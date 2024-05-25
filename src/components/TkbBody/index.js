import React, { useState } from 'react';
import './TkbBody.scss';
import Tkb from './Tkb';
import HocPhan from './HocPhan';

import TkbContext from '~/components/pades/Tkbs/Context';
import Loading from '../Loading/Loading';
import Context from '~/store/Context';
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom';

function TkbBody() {
    const [tkbState, tkbDispath] = React.useContext(TkbContext);
    const [state, dispath] = React.useContext(Context);

    var soTC = 0;

    const { tkbid } = useParams();

    const tabViewChile = tkbState.currTkb?.ma_hoc_phans?.map((el, index) => {
        var ct = tkbState.ds_nhom_to?.find((e) => e.ma_mon === el)?.so_tc;
        soTC += ct;
        return <HocPhan key={index} maHocPhan={el} />;
    });

    React.useEffect(() => {
        if (tkbid && tkbid !== 'new')
            state.user?.getTkb(tkbid.replace('/', '')).then((e) => {
                console.log(e);
                var temp = {};
                e.id_to_hocs.forEach((element) => {
                    var nhom = tkbState.ds_nhom_to?.find((e) => e.id_to_hoc === element);
                    if (nhom) temp[nhom.ma_mon] = element;
                });
                tkbDispath({ path: 'mahp_idtohoc', value: temp });
                tkbDispath({ path: 'currTkb', value: e });
            });
        else if (tkbid === 'new') {
            var newTKb = state.user.createNewTkb();
            tkbDispath({ path: 'currTkb', value: newTKb });
        }

        return () => {
            tkbDispath({ path: 'mahp_idtohoc', value: {} });
            tkbDispath({ path: 'currTkb', value: null });
        };
    }, [tkbid, state.user, tkbDispath, tkbState.ds_nhom_to]);

    React.useEffect(() => {
        document.title = tkbState.currTkb?.name + ' | TKB SGU';
        return () => {
            document.title = 'TKB SGU';
        };
    }, [tkbState.currTkb]);

    React.useEffect(() => {
        tkbDispath({ path: 'xo_tin_chi', value: soTC });
    }, [soTC, tkbDispath]);

    const [isAddHpShow, setAddHpShow] = useState(false);
    const [search, setSearch] = useState('');

    const addHpPopupShow = () => {
        console.log('add hp');
        setAddHpShow(true);
    };

    return (
        <div className="tkb_body">
            <div className="tkb_body_left_side">
                <div className="tkb_top">
                    <span className="title">TÍN CHỈ: {tkbState.xo_tin_chi}/26</span>
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
                                    {Object.keys(tkbState.ds_mon_hoc || {})
                                        .map((key) => [key, tkbState.ds_mon_hoc[key]])
                                        .filter((e) => e[0].includes(search) || e[1].includes(search))
                                        .map((e, i) => {
                                            return (
                                                <div className="hp" key={i}>
                                                    <label className="container">
                                                        <input
                                                            type="checkbox"
                                                            checked={tkbState.currTkb?.ma_hoc_phans.includes(e[0])}
                                                            onChange={(event) => {
                                                                if (event.target.checked) {
                                                                    tkbState.currTkb?.ma_hoc_phans.push(e[0]);
                                                                } else {
                                                                    const index =
                                                                        tkbState.currTkb?.ma_hoc_phans.indexOf(e[0]);
                                                                    if (index > -1) {
                                                                        // only splice array when item is found
                                                                        tkbState.currTkb?.ma_hoc_phans.splice(index, 1); // 2nd parameter means remove one item only
                                                                        delete tkbState.mahp_idtohoc[e[0]];
                                                                    }
                                                                }
                                                                tkbDispath({
                                                                    path: 'currTkb',
                                                                    value: tkbState.currTkb,
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
                    {tkbState.ds_nhom_to && tkbState.ds_mon_hoc && tkbState.currTkb ? (
                        <div className="tab-view">{tabViewChile}</div>
                    ) : (
                        <div style={{ height: '50%' }}>
                            <Loading cellSize="20px" />
                        </div>
                    )}
                </div>
            </div>
            <div className="tkb_view">
                <Tkb row={14} column={7} />
            </div>
        </div>
    );
}

export default TkbBody;
