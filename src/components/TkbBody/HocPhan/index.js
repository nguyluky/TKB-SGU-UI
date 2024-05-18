import React from 'react';
import { TkbContext } from '~/components/pades/Tkb';
import './HocPhan.scss';

function HocPhan({ maHocPhan }) {
    const [state, dispath] = React.useContext(TkbContext);

    const HPDisplayName = state.ds_mon_hoc[maHocPhan];
    const ct = state.ds_nhom_to.find((e) => e.ma_mon == maHocPhan)?.so_tc;

    const [isDrop, setDrop] = React.useState(false);

    const dropDowHandle = () => {
        setDrop(!isDrop);
    };
    return (
        <div className="hoc-phan">
            <div className="info" onClick={dropDowHandle}>
                <span className="drop-down">
                    <box-icon name={!isDrop ? 'chevron-down' : 'chevron-up'}></box-icon>
                </span>
                <span className="hp-name">{HPDisplayName}</span>
                <span className="ct">CT {ct}</span>
            </div>
            <div className="drop-dow" style={!isDrop ? { height: 0 } : {}}>
                {state.ds_nhom_to
                    .filter((e) => e.ma_mon == maHocPhan)
                    ?.map((e, i) => {
                        var tkb = e.tkb;

                        const handleMouseEnter = () => {
                            dispath({ path: 'tiet_templay', value: e.id_to_hoc });
                        };

                        const handleMouseLeave = () => {
                            dispath({ path: 'tiet_templay', value: '' });
                        };

                        return (
                            <div
                                key={i}
                                className="nhom-hoc"
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <p>{tkb.map((e) => `T${e.thu} - ${e.phong}`)?.join(' | ')}</p>
                                <p>GV: </p>
                                {Array.from(new Set(tkb.map((e) => e.gv)))
                                    ?.map((e) => ` |- ${e}`)
                                    .join(' | ')}
                                <p>Slot: ....</p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default HocPhan;
