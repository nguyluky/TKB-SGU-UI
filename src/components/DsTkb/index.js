import React, { useContext, useEffect } from 'react';

import './DsTkb.scss';
import Context from '~/store/Context';
import { tkbContext } from '../pades/Tkbs';
import Loading from '../Loading/Loading';

function Card() {
    return <div className="card"></div>;
}

function DsTkb() {
    const [state] = useContext(Context);
    const [tkbState, tkbDispath] = useContext(tkbContext);

    useEffect(() => {
        if (state.user) {
            state.user.getDsTkb().then((res) => {
                console.log(res);
                if (res.success) {
                    tkbDispath({ path: 'tkbs', value: res.data });
                }
            });
        }
    }, [state.user, tkbDispath]);

    return (
        <div className="ds-tkbs-body">
            <div className="tkbs-start-wall">
                <div className="tkbs-start center">
                    <div className="header">
                        <p>Bắt đầu thời khóa biểu mới</p>
                    </div>
                    <div className="start-list">
                        <Card />
                    </div>
                </div>
            </div>
            <div className="tkbs-save-wall">
                <div className="tkbs-save center">
                    <div className="header">
                        <p>Thời khóa biểu đã lưu</p>
                    </div>
                    <div>{tkbState.tkbs ? tkbState.tkbs?.length ? <p></p> : <p>không có tkb nào</p> : <Loading />}</div>
                </div>
            </div>
        </div>
    );
}

export default DsTkb;
