/* eslint-disable linebreak-style, eol-last */
const TRUE_VALUES = ['1', 'true', 'yes', 'on', 'embedded'];

const normalizeFlag = value =>
    TRUE_VALUES.includes(
        String(value || '')
            .trim()
            .toLowerCase()
    );

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
    const enabled =
        window.parent !== window &&
        (normalizeFlag(params.get('embedded')) ||
            normalizeFlag(params.get('iframeBridge')) ||
            normalizeFlag(params.get('controller')) ||
            String(params.get('mode') || '')
                .trim()
                .toLowerCase() === 'embedded');

    return {
        enabled,
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
    source: 'calliope-scratch-gui',
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