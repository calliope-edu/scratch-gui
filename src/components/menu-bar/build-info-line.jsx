import PropTypes from 'prop-types';
import React from 'react';

import {buildInfo as defaultBuildInfo, packagesLine, versionLine} from '../../lib/build-info.js';

import styles from './build-info-line.css';

/**
 * The build's version at the bottom of the settings menu, below a separator,
 * as every Calliope editor shows it (docs/build-info.md): live
 * "calliope-v1.0.0 · 7ea9962", dev a framed "dev" mark and
 * "calliope-main · a1b2c3d", and a second line with the calliope-ui and widget
 * states in editors that carry them.
 * @param {object} props - the build info to show (default: this build's)
 * @returns {React.ReactElement} the menu entry
 */
const BuildInfoLine = ({className, info = defaultBuildInfo}) => {
    const packages = packagesLine(info);
    return (
        <li
            className={className ? `${styles.buildInfo} ${className}` : styles.buildInfo}
            data-testid="build-info"
        >
            <span className={styles.line}>
                {info.channel !== 'live' && <span className={styles.channel}>{info.channel}</span>}
                <span>{versionLine(info)}</span>
            </span>
            {packages && <span className={styles.line}>{packages}</span>}
        </li>
    );
};

BuildInfoLine.propTypes = {
    className: PropTypes.string,
    info: PropTypes.shape({
        channel: PropTypes.string,
        version: PropTypes.string,
        commit: PropTypes.string,
        ui: PropTypes.shape({tag: PropTypes.string, commit: PropTypes.string}),
        widget: PropTypes.shape({tag: PropTypes.string, commit: PropTypes.string})
    })
};

export default BuildInfoLine;
