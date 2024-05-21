import React from 'react';
import './Tkb.scss';

import TkbContext from '~/components/pades/Tkbs/Context';

function Tiet({ id_to_hoc, isTemplay }) {
    const [state] = React.useContext(TkbContext);

    const nhomHoc = state.ds_nhom_to.find((e) => {
        return e.id_to_hoc === id_to_hoc;
    });

    const ma_mon = nhomHoc.ma_mon;

    var strHex = Math.abs(parseInt(ma_mon * 123));
    var r = (strHex / 255) % 255;
    var g = (strHex / (255 * 2)) % 255;
    var b = (strHex / (255 * 3)) % 255;

    return (
        <>
            {nhomHoc?.tkb.map((e, i) => {
                return (
                    <div
                        key={i}
                        className={isTemplay ? 'tiet templay' : 'tiet'}
                        style={{
                            top: `calc(((100% - 55px) / 14) * ${e.tbd - 1} + 55px )`,
                            left: `calc(((100% - 55px) / 7 ) * ${e.thu - 2} + 55px)`,
                            height: `calc(((100% - 55px) / 14) * ${e.tkt - e.tbd + 1} - 3px)`,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
                                borderColor: `rgb(${r}, ${g}, ${b})`,
                            }}
                        >
                            <p>{nhomHoc.ten_mon}</p>
                            <p>Phòng: {e.phong}</p>
                            <p>GV: {e.gv}</p>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

function Tkb({ row, column }) {
    const thu = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    const [state] = React.useContext(TkbContext);

    return (
        <>
            <div className="tkb" style={{ gridTemplateRows: `55px repeat(${row}, 1fr)` }}>
                <div className="tkb-row head" style={{ gridTemplateColumns: `55px repeat(${column}, 1fr)` }}>
                    <div className="tkb-colmun head"></div>
                    {Array.from(Array(column).keys()).map((e) => {
                        return (
                            <div className="tkb-colmun" key={e}>
                                {thu[e]}
                            </div>
                        );
                    })}
                </div>
                {Array.from(Array(row).keys()).map((index) => {
                    return (
                        <div
                            className="tkb-row"
                            key={index}
                            style={{ gridTemplateColumns: `55px repeat(${column}, 1fr)` }}
                        >
                            <div className="tkb-colmun head">Tiết {index + 1}</div>
                            {Array.from(Array(column).keys()).map((e) => {
                                return <div className="tkb-colmun" key={e}></div>;
                            })}
                        </div>
                    );
                })}
                <div className="tkb-tiet-view">
                    {state.tiet_templay ? <Tiet id_to_hoc={state.tiet_templay} isTemplay={true} /> : ''}
                    {Object.values(state.tiet_da_chon)?.map((e, i) => {
                        return <Tiet id_to_hoc={e} key={i} />;
                    })}
                </div>
            </div>
        </>
    );
}

export default Tkb;
