import React from 'react';
import './TkbBody.scss';
import Tippy from '@tippyjs/react';
import Tkb from './Tkb';

function TkbBody() {
    return (
        <div className="tkb_body">
            <div className="tkb_body_left_side">
                <div className="tkb_top">
                    <span>Số tính chỉ: 10/26</span>
                    <Tippy
                        content={
                            <div
                                id="tooltip"
                                role="tooltip"
                                style={{ backgroundColor: 'darkgray', padding: '2px', borderRadius: '5px' }}
                                tabIndex="-1"
                                data-popper-placement="bottom"
                            >
                                <span>Học thêm</span>
                                <div id="arrow" data-popper-arrow></div>
                            </div>
                        }
                        placement="bottom"
                        delay={[500, 0]}
                        theme="material"
                    >
                        <button className="button_add">
                            <box-icon name="plus"></box-icon>
                        </button>
                    </Tippy>
                </div>
                <div className="tkb_list_view">
                    <div className="tab-master">
                        <div className="tab">Tất cả</div>
                        <div className="tab">Đã chon</div>
                    </div>
                    <div className="tab-view"></div>
                </div>
            </div>
            <div className="tkb_view">
                <Tkb row={14} column={7} />
            </div>
        </div>
    );
}

export default TkbBody;
