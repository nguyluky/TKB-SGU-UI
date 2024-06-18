import { useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DsNhomHocResp, cx } from './Tkb';

export function AddHp({ data, onAddHp }: { data?: DsNhomHocResp; onAddHp?: (maHocPhan: string) => void }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [search, setSearch] = useState('');

    return (
        <div className={cx('add-popup')}>
            <div className={cx('header')}>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Thêm học phần"
                />
                <button className={cx('filter')}>filter</button>
            </div>

            <div className={cx('filter')}>{/* TODO: thêm filter */}</div>

            <div className={cx('body')}>
                <div className={cx('relust')}>
                    {Object.keys(data?.ds_mon_hoc || {}).map((e) => {
                        var display = data?.ds_mon_hoc[e] + ' ' + e;
                        if (!display.includes(search)) return null;
                        return (
                            <div
                                className={cx('monhoc')}
                                key={e}
                                onClick={() => {
                                    if (onAddHp) onAddHp(e);
                                }}
                            >
                                {display}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
