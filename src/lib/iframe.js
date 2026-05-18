/* eslint-disable linebreak-style, eol-last */

/**
 * Bridge between this Scratch iframe and the embedding host (e.g.
 * calliope-campus). Bridge is on whenever the page is framed — no URL
 * opt-in needed. Standalone tabs see no bridge behaviour.
 */

const getSearchParams = () => {
    if (typeof window === 'undefined') {
        return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search || '');
};

export const getIframeBridgeConfig = () => {
    if (typeof window === 'undefined') {
        return {
            enabled: false,
            instanceId: null,
            parentOrigin: '*'
        };
    }

    const params = getSearchParams();
    const enabled = window.parent && window.parent !== window;

    return {
        enabled: Boolean(enabled),
        instanceId: String(params.get('instance') || '').trim() || null,
        parentOrigin: String(params.get('parentOrigin') || '').trim() || '*'
    };
};

export const createBridgeMessage = ({
    type,
    data,
    instanceId = null,
    meta = {}
}) => ({
    source: 'calliope-blocks-gui',
    version: 2,
    instanceId,
    type,
    data,
    meta
});

export const postParentMessage = (
    message,
    config = getIframeBridgeConfig()
) => {
    if (
        typeof window === 'undefined' ||
        !config.enabled ||
        window.parent === window
    ) {
        return;
    }
    window.parent.postMessage(message, config.parentOrigin || '*');
};

export const isParentMessage = (
    event,
    config = getIframeBridgeConfig()
) => {
    if (typeof window === 'undefined' || !config.enabled) {
        return false;
    }
    if (event.source !== window.parent) {
        return false;
    }
    if (
        config.parentOrigin &&
        config.parentOrigin !== '*' &&
        event.origin !== config.parentOrigin
    ) {
        return false;
    }
    return true;
};

export const isBridgePayloadForInstance = (
    payload,
    config = getIframeBridgeConfig()
) => {
    if (!payload || typeof payload !== 'object') {
        return false;
    }
    if (!config.instanceId || !payload.instanceId) {
        return true;
    }
    return payload.instanceId === config.instanceId;
};
