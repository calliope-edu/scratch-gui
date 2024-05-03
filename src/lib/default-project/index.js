import projectData from './project-data';

/* eslint-disable import/no-unresolved */
import backdrop from '!raw-loader!./cd21514d0531fdffb22204e0ec5ed84a.svg';
import costume1 from '!raw-loader!./af5b4ee04f18feedd3729336a0640ef4.svg';
import costume2 from '!raw-loader!./2a9fee6a9b1f71c86564321a56488b37.svg';

/* eslint-enable import/no-unresolved */

const defaultProject = translator => {
    let _TextEncoder;
    if (typeof TextEncoder === 'undefined') {
        _TextEncoder = require('text-encoding').TextEncoder;
    } else {
        /* global TextEncoder */
        _TextEncoder = TextEncoder;
    }
    const encoder = new _TextEncoder();

    const projectJson = projectData(translator);
    return [
        {
            id: 0,
            assetType: 'Project',
            dataFormat: 'JSON',
            data: JSON.stringify(projectJson)
        },
        {
            id: 'cd21514d0531fdffb22204e0ec5ed84a',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(backdrop)
        },
        {
            id: 'af5b4ee04f18feedd3729336a0640ef4',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(costume1)
        },
        {
            id: '2a9fee6a9b1f71c86564321a56488b37',
            assetType: 'ImageVector',
            dataFormat: 'SVG',
            data: encoder.encode(costume2)
        }
    ];
};

export default defaultProject;
