import React from 'react';
import './TkbBody.scss';
import Tippy from '@tippyjs/react';
import Tkb from './Tkb';
import HocPhan from './HocPhan';

import { TkbContext } from '~/components/pades/Tkb';

function TkbBody() {
    const [state, dispath] = React.useContext(TkbContext);
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
                        {state.hoc_phan_da_chon.map((el, index) => {
                            return <HocPhan key={index} maHocPhan={el} />;
                        })}
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
