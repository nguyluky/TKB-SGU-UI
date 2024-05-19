import React from 'react';
import './TkbBody.scss';
import Tkb from './Tkb';
import HocPhan from './HocPhan';

import { TkbContext } from '~/components/pades/Tkb';

function TkbBody() {
    const [state, dispath] = React.useContext(TkbContext);

    var soTC = 0;

    const tabViewChile = state.hoc_phan_da_chon.map((el, index) => {
        var ct = state.ds_nhom_to.find((e) => e.ma_mon == el)?.so_tc;
        soTC += ct
        return <HocPhan key={index} maHocPhan={el} />;
    })

    React.useEffect(() => {
        dispath({path: "xo_tin_chi",  value: soTC})
    }, [soTC])

    return (
        <div className="tkb_body">
            <div className="tkb_body_left_side">
                <div className="tkb_top">
                    <span className="title">TÍN CHỈ: {state.xo_tin_chi}/26</span>
                    <button className="button-add">
                        <box-icon name="plus"></box-icon>
                    </button>
                </div>
                <div className="tkb_list_view">
                    <div className="tab-view">
                        {tabViewChile}
                    </div>
                </div>
            </div>
            <div className="tkb_view">
                <Tkb row={14} column={7} />
            </div>
        </div>
    );
}

export default TkbBody;
