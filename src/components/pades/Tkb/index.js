import React from 'react';
import TkbBody from '~/components/TkbBody';
import TopBar from '~/components/TopBar';
import ToolMenu from '~/components/TopBar/ToolMenu';

function Tkb() {
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

    return (
        <>
            <TopBar>
                <ToolMenu>{tools}</ToolMenu>
            </TopBar>
            <TkbBody />
        </>
    );
}

export default Tkb;
