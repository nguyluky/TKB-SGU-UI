import React, { useEffect } from 'react';

import TopBar from '~/components/TopBar';
import tkbContext from './Context';
import reducre, { initValue } from './reducer';
import DsTkb from '~/components/DsTkb';
import TkbSguApi from '~/api/Api';
import { useLocation } from 'react-router-dom';
import ToolMenu from '~/components/ToolMenu';
import TkbBody from '~/components/TkbBody';

const saveHanel = () => {
    console.log('onclick');
};

const tools = [
    {
        displayName: 'File',
        data: [
            { displayName: 'New', onclick: saveHanel },
            { displayName: 'Save', onclick: saveHanel },
            {
                displayName: 'Save As',
                data: [
                    { displayName: 'Json', onclick: saveHanel },
                    { displayName: 'javascript', onclick: saveHanel },
                    { displayName: 'img', onclick: saveHanel },
                ],
            },
        ],
    },
    {
        displayName: 'Tool',
        data: [
            { displayName: 'Add', onclick: saveHanel },
            { displayName: 'Remove', onclick: saveHanel },
            { displayName: 'Filter', onclick: saveHanel },
        ],
    },
    {
        displayName: 'Auto',
        data: [
            { displayName: 'Random', onclick: saveHanel },
            { displayName: 'Recommend', onclick: saveHanel },
        ],
    },
];

function Tkbs() {
    const [tkbState, tkbDispath] = React.useReducer(reducre, initValue);

    const { pathname } = useLocation();
    const tkbid = pathname.replace('/tkbs', '');

    useEffect(() => {
        TkbSguApi.getDsNhomHoc().then((data) => {
            console.log(data);
            const { ds_mon_hoc, ds_nhom_to } = data;
            tkbDispath({ path: 'ds_mon_hoc', value: ds_mon_hoc });
            tkbDispath({ path: 'ds_nhom_to', value: ds_nhom_to });
        });
    }, []);

    return (
        <tkbContext.Provider value={[tkbState, tkbDispath]}>
            <TopBar>
                {!tkbid ? (
                    <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>
                ) : (
                    <ToolMenu>{tools}</ToolMenu>
                )}
            </TopBar>
            {tkbid ? <TkbBody tkbid={tkbid} /> : <DsTkb />}
        </tkbContext.Provider>
    );
}

export { tkbContext, reducre as tkbReducre, initValue as tkbInitValue };
export default Tkbs;
