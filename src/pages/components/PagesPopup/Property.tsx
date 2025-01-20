import classNames from 'classnames/bind';
import { useState } from 'react';
import PopupModel from '../../../components/PopupModel';
import { TkbInfo } from '../../../Service';

import Popup from '../../../components/Popup';
import { PopupProps } from '../../../components/Popup/types';
import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface PropertyProps extends Omit<PopupProps, 'children'> {
    tkbData: TkbInfo;
}

export default function Property({ tkbData, ...props }: PropertyProps) {
    const [tab, setTab] = useState<number>(0);

    return (
        <Popup {...props}>
            <PopupModel title="Properties" noFooter>
                <div className={cx('properties-content')}>
                    <div className={cx('side-bar')}>
                        <label className={cx('side-bar-line')}>
                            <input
                                type="radio"
                                name="setting-tab"
                                checked={tab === 0}
                                onChange={(e) => {
                                    if (e.target.checked) setTab(0);
                                }}
                            />
                            General
                        </label>
                        <label className={cx('side-bar-line')}>
                            <input
                                type="radio"
                                name="setting-tab"
                                checked={tab === 1}
                                onChange={(e) => {
                                    if (e.target.checked) setTab(1);
                                }}
                            />
                            Member
                        </label>

                        <label className={cx('side-bar-line', 'end')}>Delete</label>
                    </div>
                    <div className={cx('body')}>
                        {tab === 0 ? (
                            <>
                                <div className={cx('setting-line')}>
                                    <span>Name:</span>
                                    <span>{tkbData.name}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>Describe:</span>
                                    <span>{tkbData.tkb_describe}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>quyền hạn:</span>
                                    <span>{'chưa làm aip'}</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>Members:</span>
                                    <span>1</span>
                                </div>

                                <div className={cx('setting-line')}>
                                    <span>ngày tạo:</span>
                                    <span>{tkbData.created.toISOString()}</span>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </PopupModel>
        </Popup>
    );
}
