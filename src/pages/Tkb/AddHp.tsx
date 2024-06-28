import { useState } from 'react';
import { DsNhomHocResp, cx } from './Tkb';

export function AddHp({
    data,
    onAddHp,
    maHocPhans,
}: {
    data?: DsNhomHocResp;
    onAddHp?: (maHocPhan: string) => void;
    maHocPhans?: string[];
}) {
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
                        if (!display.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
                            return null;
                        return (
                            <label className={cx('monhoc')} key={e}>
                                <input
                                    type="checkbox"
                                    checked={maHocPhans?.includes(e)}
                                    onChange={() => {
                                        if (onAddHp) onAddHp(e);
                                    }}
                                />
                                <div className={cx('ten')}>{data?.ds_mon_hoc[e]}</div>
                                <div className={cx('more-info')}>{e}</div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
