/**
 * Render mode: turns a project's scripts into one SVG image, for hosts that
 * only want to show a program (Calliope Campus' teacher view), not edit it.
 *
 * No GUI, no stage, no renderer, no audio, and the VM never runs: it only
 * deserializes the project and loads the extensions its blocks use, so their
 * block definitions are known to scratch-blocks. Each target's scripts are
 * then loaded into one hidden read-only workspace, a target after the other,
 * and copied out as SVG. One SVG holds every target that has blocks, stacked
 * top to bottom, each under its name (when there is more than one).
 *
 * Protocol (postMessage between the host window and this page):
 *   → host: {source: 'calliope-blocks-render', type: 'renderready'}
 *   ← host: {type: 'renderblocks', id, project, locale}
 *   → host: {source: 'calliope-blocks-render', type: 'renderblocks', id,
 *            svg, width, height, error}
 * Requests are answered one at a time, in order. The answer goes to the
 * window that asked, at its origin: the SVG is nothing a page could not make
 * itself from the same project.
 *
 * NOTE: promise chains, not async/await — scratch-gui transpiles to ES5
 * without regenerator-runtime (see containers/blocks.jsx).
 */
import VM from 'scratch-vm';
import editorMessages from 'scratch-l10n/locales/editor-msgs';

import makeScratchBlocks from '../lib/blocks';
import defineDynamicBlock from '../lib/define-dynamic-block';
import {DEFAULT_THEME, getColorsForTheme} from '../lib/themes';

const SOURCE = 'calliope-blocks-render';
const MEDIA_PATH = 'static/blocks-media/default/';
/** Space between two targets' scripts, and the height of a target's name. */
const TARGET_GAP = 48;
const LABEL_HEIGHT = 36;
const PADDING = 16;
const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

const vm = new VM();
const ScratchBlocks = makeScratchBlocks(vm, false);

const defineBlocks = (categoryInfo, blockInfoArray) => {
    if (!blockInfoArray || blockInfoArray.length === 0) return;
    const staticBlocksJson = [];
    blockInfoArray.forEach(blockInfo => {
        if (blockInfo.info && blockInfo.info.isDynamic) {
            const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
            ScratchBlocks.Blocks[extendedOpcode] = defineDynamicBlock(
                ScratchBlocks,
                categoryInfo,
                blockInfo,
                extendedOpcode
            );
        } else if (blockInfo.json) {
            staticBlocksJson.push(blockInfo.json);
        }
    });
    ScratchBlocks.defineBlocksWithJsonArray(staticBlocksJson);
};

// Same as the editor's Blocks container does it: menus and custom fields are
// shadow blocks, so they have to be defined along with the blocks.
const handleExtensionAdded = categoryInfo => {
    defineBlocks(
        categoryInfo,
        Object.getOwnPropertyNames(categoryInfo.customFieldTypes).map(
            name => categoryInfo.customFieldTypes[name].scratchBlocksDefinition
        )
    );
    defineBlocks(categoryInfo, categoryInfo.menus);
    defineBlocks(categoryInfo, categoryInfo.blocks);
};
vm.addListener('EXTENSION_ADDED', handleExtensionAdded);
vm.addListener('BLOCKSINFO_UPDATE', handleExtensionAdded);

let latestXml = null;
vm.addListener('workspaceUpdate', data => {
    latestXml = data.xml;
});

const host = document.createElement('div');
// Laid out (Blockly measures text), but out of sight.
host.style.cssText = 'position:absolute;left:-10000px;top:0;width:2000px;height:2000px;';
document.body.appendChild(host);

const workspace = ScratchBlocks.inject(host, {
    readOnly: true,
    media: MEDIA_PATH,
    zoom: {controls: false, wheel: false, startScale: 1},
    scrollbars: false,
    trashcan: false,
    sounds: false,
    comments: true,
    colours: getColorsForTheme(DEFAULT_THEME)
});

let currentLocale = null;
const setLocale = locale => {
    const next = editorMessages[locale] ? locale : 'en';
    if (next === currentLocale) return Promise.resolve();
    currentLocale = next;
    ScratchBlocks.ScratchMsgs.setLocale(next);
    // Extension block texts come from the VM's locale.
    return vm.setLocale(next, editorMessages[next]);
};

// The scratch-blocks media (green flag, arrows, ...) are inlined as data
// URIs: the SVG is shown on another origin, possibly as an <img>.
const mediaCache = {};
const toDataUri = url => {
    if (!mediaCache[url]) {
        mediaCache[url] = fetch(url)
            .then(res => (res.ok ? res.blob() : null))
            .then(blob => {
                if (!blob) return url;
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => resolve(url);
                    reader.readAsDataURL(blob);
                });
            })
            .catch(() => url);
    }
    return mediaCache[url];
};

const inlineImages = root => {
    const images = Array.prototype.slice.call(root.querySelectorAll('image'));
    return Promise.all(images.map(image => {
        const href = image.getAttributeNS(XLINK_NS, 'href') || image.getAttribute('href');
        if (!href || href.indexOf('data:') === 0) return null;
        const absolute = new URL(href, document.baseURI).href;
        return toDataUri(absolute).then(dataUri => {
            image.removeAttributeNS(XLINK_NS, 'href');
            image.setAttribute('href', dataUri);
        });
    }));
};

// Only the Blockly rules that match something in the image, so every SVG
// does not carry the whole editor stylesheet.
const collectCss = root => {
    const rules = [];
    Array.prototype.forEach.call(document.styleSheets, sheet => {
        let cssRules;
        try {
            cssRules = sheet.cssRules;
        } catch (e) {
            return;
        }
        Array.prototype.forEach.call(cssRules, rule => {
            if (!rule.selectorText || rule.selectorText.indexOf(':') !== -1) return;
            try {
                if (root.querySelector(rule.selectorText)) rules.push(rule.cssText);
            } catch (e) {
                // A selector querySelector does not know; not needed for a still image.
            }
        });
    });
    return rules.join('\n');
};

const unionBox = boxes => {
    const real = boxes.filter(b => b && (b.width > 0 || b.height > 0));
    if (real.length === 0) return null;
    const x = Math.min.apply(null, real.map(b => b.x));
    const y = Math.min.apply(null, real.map(b => b.y));
    const right = Math.max.apply(null, real.map(b => b.x + b.width));
    const bottom = Math.max.apply(null, real.map(b => b.y + b.height));
    return {x, y, width: right - x, height: bottom - y};
};

/**
 * Loads one target into the workspace and copies its scripts out.
 * @param {RenderedTarget} target - The sprite or stage.
 * @returns {?object} Its name, bounding box and copied layers; null when it has no scripts.
 */
const snapshotTarget = target => {
    // Not vm.setEditingTarget: it does nothing for the target already being
    // edited, and would announce the switch to a GUI there is none of.
    latestXml = null;
    vm.editingTarget = target;
    vm.runtime.setEditingTarget(target);
    vm.emitWorkspaceUpdate();
    if (!latestXml) return null;
    ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(ScratchBlocks.Xml.textToDom(latestXml), workspace);
    if (workspace.getTopBlocks(false).length === 0 && workspace.getTopComments(false).length === 0) {
        return null;
    }
    const canvas = workspace.getCanvas();
    const bubbles = workspace.getBubbleCanvas();
    const box = unionBox([canvas.getBBox(), bubbles.getBBox()]);
    if (!box) return null;
    const group = document.createElementNS(SVG_NS, 'g');
    [canvas, bubbles].forEach(layer => {
        const copy = layer.cloneNode(true);
        copy.removeAttribute('transform');
        group.appendChild(copy);
    });
    return {name: target.getName(), isStage: target.isStage, box, group};
};

const renderProject = (project, locale) => setLocale(locale)
    .then(() => vm.loadProject(project))
    .then(() => {
        // Sprites in the project's order, the stage last: what children build is in
        // their sprites, the stage rarely has scripts.
        const targets = vm.runtime.targets
            .filter(t => t.isOriginal)
            .sort((a, b) => (a.isStage === b.isStage ? 0 : (a.isStage ? 1 : -1)));
        const parts = targets.map(snapshotTarget).filter(Boolean);
        workspace.clear();

        const svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('xmlns', SVG_NS);
        svg.setAttribute('xmlns:xlink', XLINK_NS);
        svg.setAttribute('class', 'blocklySvg');
        const defs = workspace.getParentSvg().querySelector('defs');
        if (defs) svg.appendChild(defs.cloneNode(true));

        const labelled = parts.length > 1;
        let y = PADDING;
        let width = 0;
        parts.forEach(part => {
            if (labelled) {
                const label = document.createElementNS(SVG_NS, 'text');
                label.setAttribute('x', PADDING);
                label.setAttribute('y', y + (LABEL_HEIGHT * 0.65));
                label.setAttribute('fill', '#000000');
                label.setAttribute('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif');
                label.setAttribute('font-size', '20');
                label.setAttribute('font-weight', 'bold');
                label.textContent = part.name;
                svg.appendChild(label);
                y += LABEL_HEIGHT;
            }
            part.group.setAttribute(
                'transform',
                `translate(${PADDING - part.box.x}, ${y - part.box.y})`
            );
            svg.appendChild(part.group);
            y += part.box.height + TARGET_GAP;
            width = Math.max(width, part.box.width);
        });

        const totalWidth = Math.ceil(width + (2 * PADDING));
        const totalHeight = Math.ceil(parts.length ? y - TARGET_GAP + PADDING : 2 * PADDING);
        svg.setAttribute('width', totalWidth);
        svg.setAttribute('height', totalHeight);
        svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

        // The rules are matched against the copy while it is still in this
        // document, under the class the workspace's own svg has.
        host.appendChild(svg);
        const css = collectCss(svg);
        host.removeChild(svg);
        const style = document.createElementNS(SVG_NS, 'style');
        style.textContent = css;
        svg.insertBefore(style, svg.firstChild);

        return inlineImages(svg).then(() => ({
            svg: new XMLSerializer().serializeToString(svg),
            width: totalWidth,
            height: totalHeight,
            targets: parts.length
        }));
    });

let queue = Promise.resolve();
window.addEventListener('message', event => {
    const msg = event.data;
    if (!msg || msg.type !== 'renderblocks' || !event.source) return;
    const reply = data => {
        event.source.postMessage(
            Object.assign({source: SOURCE, type: 'renderblocks', id: msg.id}, data),
            event.origin === 'null' ? '*' : event.origin
        );
    };
    queue = queue
        .then(() => renderProject(msg.project, msg.locale))
        .then(reply, error => reply({error: (error && error.message) || String(error)}));
});

if (window.parent !== window) {
    window.parent.postMessage({source: SOURCE, type: 'renderready'}, '*');
}
