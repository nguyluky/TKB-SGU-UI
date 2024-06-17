import { useState } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DsNhomHocResp, cx } from './Tkb';

export function AddHp({ data, onAddHp }: { data?: DsNhomHocResp; onAddHp?: (maHocPhan: string) => void }) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [search, setSearch] = useState('');

    // const relust = Object.keys(data?.ds_mon_hoc || {})
    //     .map((e) => data?.ds_mon_hoc[e] + ' ' + e)
    //     .filter((e) => e.includes(search));

    return (
        <div className={cx('add-popup')}>
            <div className="header">
                {/* TODO: nho them giau vao */}
                <h2 className="title">them hoc phan</h2>
                <FontAwesomeIcon icon={faClose} />
            </div>

            <div className="body">
                <div className="search">
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>

                <div className="relust">
                    {Object.keys(data?.ds_mon_hoc || {}).map((e) => {
                        var display = data?.ds_mon_hoc[e] + ' ' + e;
                        if (!display.includes(search)) return null;
                        return (
                            <div
                                className="monhoc"
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
