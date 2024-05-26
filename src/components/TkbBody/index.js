import React, { useState } from 'react';
import './TkbBody.scss';
import Tkb from './Tkb';
import HocPhan from './HocPhan';

import Context from '~/store/GlobalStore/Context';
import Popup from 'reactjs-popup';
import { useLoaderData } from 'react-router-dom';
import Err from '../Err';
import ToolMenu from '../ToolMenu';

function SavePopup() {
    return <div>SavePopup</div>;
}

const saveHanel = () => {
    console.log('hello');
};

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

function TkbBody() {
    const [state, dispath] = React.useContext(Context);
    const [err, setErr] = useState(null);

    const data = useLoaderData();
    const { tkb, ds_mon_hoc, ds_nhom_to } = data;

    var soTC = 0;

    const hocPhans = state.currTkb?.ma_hoc_phans?.map((el, index) => {
        var ct = state.ds_nhom_to?.find((e) => e.ma_mon === el)?.so_tc;
        soTC += ct;
        return <HocPhan key={index} maHocPhan={el} />;
    });

    React.useEffect(() => {
        if (tkb.code) {
            setErr(tkb.code);
        } else {
            document.title = tkb?.name + ' | TKB SGU';
            var temp = {};
            tkb.id_to_hocs?.forEach((element) => {
                var nhom = (state.ds_nhom_to || ds_nhom_to)?.find((e) => e.id_to_hoc === element);
                if (nhom) temp[nhom.ma_mon] = element;
            });
            dispath({ path: 'mahp_idtohoc', value: temp });
            dispath({ path: 'currTkb', value: tkb });
        }
        dispath({ path: 'ds_mon_hoc', value: ds_mon_hoc });
        dispath({ path: 'ds_nhom_to', value: ds_nhom_to });

        state.topbar.left = <ToolMenu>{tools}</ToolMenu>;
        dispath({ path: 'topbar', value: state.topbar });

        return () => {
            dispath({ path: 'mahp_idtohoc', value: {} });
            dispath({ path: 'currTkb', value: null });
        };
    }, []);

    React.useEffect(() => {
        dispath({ path: 'xo_tin_chi', value: soTC });
    }, [soTC, dispath]);

    const [isAddHpShow, setAddHpShow] = useState(false);
    const [search, setSearch] = useState('');

    const addHpPopupShow = () => {
        setAddHpShow(true);
    };

    return (
        <div className="tkb_body">
            {!err ? (
                <>
                    <div className="tkb_body_left_side">
                        <div className="tkb_top">
                            <span className="title">TÍN CHỈ: {state.xo_tin_chi}/26</span>
                            <button className="button-add" onClick={addHpPopupShow}>
                                <box-icon name="link-external"></box-icon>
                            </button>
                            <Popup
                                open={isAddHpShow}
                                closeOnDocumentClick
                                closeOnEscape
                                onClose={() => {
                                    setAddHpShow(false);
                                    setSearch('');
                                }}
                            >
                                <div className="add-hp-popup">
                                    <label className="search-input">
                                        <box-icon name="search-alt-2"></box-icon>
                                        <input
                                            placeholder="Tên môn học hoặc mã học phần"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                        />
                                    </label>
                                    <div className="ketqua">
                                        <div className="conten">
                                            {Object.keys(state.ds_mon_hoc || {})
                                                .map((key) => [key, state.ds_mon_hoc[key]])
                                                .filter((e) => e[0].includes(search) || e[1].includes(search))
                                                .map((e, i) => {
                                                    return (
                                                        <div className="hp" key={i}>
                                                            <label className="container">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={state.currTkb?.ma_hoc_phans.includes(e[0])}
                                                                    onChange={(event) => {
                                                                        if (event.target.checked) {
                                                                            state.currTkb?.ma_hoc_phans.push(e[0]);
                                                                        } else {
                                                                            const index =
                                                                                state.currTkb?.ma_hoc_phans.indexOf(
                                                                                    e[0],
                                                                                );
                                                                            if (index > -1) {
                                                                                // only splice array when item is found
                                                                                state.currTkb?.ma_hoc_phans.splice(
                                                                                    index,
                                                                                    1,
                                                                                ); // 2nd parameter means remove one item only
                                                                                delete state.mahp_idtohoc[e[0]];
                                                                            }
                                                                        }
                                                                        dispath({
                                                                            path: 'currTkb',
                                                                            value: state.currTkb,
                                                                        });
                                                                    }}
                                                                />
                                                                <svg viewBox="0 0 64 64" height="20px" width="20px">
                                                                    <path
                                                                        d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                                                                        pathLength="575.0541381835938"
                                                                        className="path"
                                                                    ></path>
                                                                </svg>
                                                            </label>
                                                            <div className="name">
                                                                {e[1]} - {e[0]}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </div>
                        <div className="tkb_list_view">
                            <div className="tab-view">{hocPhans}</div>
                        </div>
                    </div>
                    <div className="tkb_view">
                        <Tkb row={14} column={7} />
                    </div>
                </>
            ) : (
                <>
                    <Err code={err} />
                </>
            )}
        </div>
    );
}

export default TkbBody;
