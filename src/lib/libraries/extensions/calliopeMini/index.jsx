let formatMessage = messageData => messageData.defaultMessage;

/**
 * Calliope mini extension
 */

import IconURL from './entry-icon.png';
import InsetIconURL from './inset-icon.svg';
import ConnectionIconURL from './connection-icon.svg';
import ConnectionSmallIconURL from './connection-small-icon.svg';
import translations from './translations.json';

const entry = {
    get name() {
        return formatMessage({
            defaultMessage: 'Calliope mini',
            description: 'Name of this extension',
            id: 'calliopeMini.entry.name'
        });
    },
    extensionId: 'calliopeMini',
    extensionURL: '',
    collaborator: '',
    iconURL: IconURL,
    insetIconURL: InsetIconURL,
    get description() {
        return formatMessage({
            defaultMessage: 'Play with all functions of Calliope mini.',
            description: "Description for the 'Calliope mini' extension",
            id: 'mbitMore.entry.description'
        });
    },
    featured: true,
    disabled: false,
    bluetoothRequired: true,
    internetConnectionRequired: false,
    launchPeripheralConnectionFlow: true,
    useAutoScan: false,
    connectionIconURL: ConnectionIconURL,
    connectionSmallIconURL: ConnectionSmallIconURL,
    get connectingMessage() {
        return formatMessage({
            defaultMessage: 'Connecting',
            description:
                'Message to help people connect to their Calliope mini.',
            id: 'gui.extension.microbit.connectingMessage'
        });
    },
    helpLink:
        'https://calliope.cc/programmieren/editoren/calliope-mini-blocks-scratch-programmieren',
    setFormatMessage: formatter => {
        formatMessage = formatter;
    },
    translationMap: translations
};

export {entry}; // loadable-extension needs this line.
export default entry;
