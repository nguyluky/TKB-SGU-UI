import React from 'react';
import TkbBody from '~/components/TkbBody';
import TopBar from '~/components/TopBar';
import ToolMenu from '~/components/TopBar/ToolMenu';

import TkbSguApi from '~/api/Api';
import { tkbReducre, tkbInitValue, tkbContext } from '../Tkbs';
import { useParams } from 'react-router-dom';

function Tkb() {
    const [state, dispath] = React.useReducer(tkbReducre, tkbInitValue);
    const { tkbid } = useParams();

    console.log(tkbid);

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

    React.useEffect(() => {
        document.title = 'Untitled | TKB SGU';

        TkbSguApi.getDsNhomHoc().then((data) => {
            // console.log(data);
            const { ds_mon_hoc, ds_nhom_to } = data;
            dispath({ path: 'ds_mon_hoc', value: ds_mon_hoc });
            dispath({ path: 'ds_nhom_to', value: ds_nhom_to });
        });
    }, []);

    return (
        <tkbContext.Provider value={[state, dispath]}>
            <TopBar>
                <ToolMenu>{tools}</ToolMenu>
            </TopBar>
            <TkbBody />
        </tkbContext.Provider>
    );
}

export default Tkb;
