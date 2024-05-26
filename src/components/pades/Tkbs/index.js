import React, { useEffect, useRef } from 'react';

import TopBar from '~/components/TopBar';
import tkbContext from './Context';
import reducre, { initValue } from './reducer';
import TkbSguApi from '~/api/Api';
import { Outlet, useParams, useNavigation, useLoaderData } from 'react-router-dom';
import ToolMenu from '~/components/ToolMenu';
import Loading from '~/components/Loading/Loading';

const saveHanel = () => {
    console.log('onclick');
};

function SavePopup() {
    return <div>SavePopup</div>;
}

const tools = [
    {
        displayName: 'File',
        data: [
            { icon: 'file', displayName: 'Mới', onclick: saveHanel, element: <SavePopup /> },
            { icon: 'folder', displayName: 'Mở', onclick: saveHanel },
            {
                displayName: 'Tạo bản sao',
                icon: 'copy',
                onclick: saveHanel,
            },
            {
                displayName: 'Chia sẻ',
                icon: 'user-plus',
                onclick: saveHanel,
            },
            {
                displayName: 'Tải xuống',
                icon: 'download',
                onclick: saveHanel,
                data: [
                    { displayName: 'json (.json)', onclick: saveHanel },
                    { displayName: 'ảnh (.png)', onclick: saveHanel },
                    { displayName: 'javascript (.js)', onclick: saveHanel },
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

function NameTkb() {
    const [tkbState, tkbDispath] = React.useContext(tkbContext);

    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) ref.current.value = tkbState.currTkb?.name;
    }, [tkbState.currTkb, ref]);

    return (
        <input
            className="name-input"
            ref={ref}
            style={{
                backgroundColor: 'transparent',
                outline: 'none',
                border: 'none',
                textAlign: 'center',
                fontSize: '16px',
            }}
            onBlur={(event) => {
                tkbState.currTkb.updateName(event.target.value).then((e) => {
                    document.title = event.target.value + ' | TKB SGU';
                });
            }}
        />
    );
}

function Tkbs() {
    const [tkbState, tkbDispath] = React.useReducer(reducre, initValue);

    const { tkbid } = useParams();

    const navigation = useNavigation();

    const { resp } = useLoaderData();
    useEffect(() => {
        const { ds_mon_hoc, ds_nhom_to } = resp;
        tkbDispath({ path: 'ds_mon_hoc', value: ds_mon_hoc });
        tkbDispath({ path: 'ds_nhom_to', value: ds_nhom_to });
    }, [resp]);

    return (
        <tkbContext.Provider value={[tkbState, tkbDispath]}>
            <TopBar center={tkbid ? <NameTkb /> : ''}>
                {!tkbid ? (
                    <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>
                ) : (
                    <ToolMenu>{tools}</ToolMenu>
                )}
            </TopBar>
            {navigation.state !== 'loading' ? (
                <Outlet />
            ) : (
                <div
                    style={{
                        height: 'calc(100% - 55px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Loading />
                </div>
            )}
        </tkbContext.Provider>
    );
}

export { tkbContext, reducre as tkbReducre, initValue as tkbInitValue };
export default Tkbs;
