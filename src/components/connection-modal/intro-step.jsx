import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Box from '../box/box.jsx';
import helpIcon from './icons/help.svg';
import bluetoothIcon from './icons/bluetooth.svg';

import styles from './connection-modal.css';

const UnavailableStep = props => (
    <Box className={styles.body}>
        <Box className={styles.activityArea}>
            <div className={styles.scratchLinkHelp}>
                <div className={styles.scratchLinkHelpStep}>
                    <div className={styles.helpStepNumber}>{'1'}</div>
                    <div className={styles.helpStepText}>
                        <FormattedHTMLMessage
                            defaultMessage="You need the <a href='{link}'>Blocks-Hex-File</a> on your Calliope mini."
                            description="Message for getting the block hex file on your Calliope mini"
                            id="gui.connection.unavailable.calliopeBlockFile"
                            values={{
                                link: 'https://blocks.calliope.cc/microbit/scratch-microbit-1.2.0.hex'
                            }}
                        />
                    </div>
                </div>
                <div className={styles.scratchLinkHelpStep}>
                    <div className={styles.helpStepNumber}>{'2'}</div>
                    <div className={styles.helpStepText}>
                        <FormattedMessage
                            defaultMessage="Check that Bluetooth is enabled"
                            description="Message for making sure Bluetooth is enabled."
                            id="gui.connection.unavailable.enablebluetooth"
                        />
                    </div>
                </div>
                <div className={styles.scratchLinkHelpStep}>
                    <div className={styles.helpStepNumber}>{'3'}</div>
                    <div className={styles.helpStepText}>
                        <FormattedMessage
                            defaultMessage="Check whether you are using a Chrome-based browser."
                            description="Message for making sure you are using a Chrome-based browser"
                            id="gui.connection.unavailable.chromeBrowser"
                        />
                    </div>
                </div>
            </div>
        </Box>
        <Box className={styles.bottomArea}>
            <Box
                className={classNames(styles.bottomAreaItem, styles.buttonRow)}
            >
                <button
                    className={styles.connectionButton}
                    onClick={props.onHelp}
                >
                    <img className={styles.buttonIconLeft} src={helpIcon} />
                    <FormattedMessage
                        defaultMessage="Help"
                        description="Button to view help content"
                        id="gui.connection.unavailable.helpbutton"
                    />
                </button>
                <button
                    className={styles.connectionButton}
                    onClick={props.onConnect}
                >
                    <img
                        className={styles.buttonIconLeft}
                        src={bluetoothIcon}
                    />
                    <FormattedMessage
                        defaultMessage="Connect"
                        description="Button to scan for devices"
                        id="gui.connection.unavailable.scanbutton"
                    />
                </button>
            </Box>
        </Box>
    </Box>
);

UnavailableStep.propTypes = {
    onHelp: PropTypes.func,
    onConnect: PropTypes.func
};

export default UnavailableStep;
