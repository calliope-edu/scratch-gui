/**
 * Post a message to the parent window
 * @param {string} message - The message to send
 */
export const postMessage = message => {
    console.log('postMessage', message);
    window.parent.postMessage(message, '*');
};

/**
 * Listen for messages from the parent window
 * @param {Function} callback - The callback to call when a message is received
 */
export const onMessage = callback => {
    window.addEventListener('message', callback);
};

/**
 * Remove the listener for messages from the parent window
 * @param {Function} callback - The callback to remove
 */
export const offMessage = callback => {
    window.removeEventListener('message', callback);
};
