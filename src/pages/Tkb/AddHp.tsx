import MiniSearch from 'minisearch';
import { useEffect, useRef, useState } from 'react';
import { DsNhomHocResp } from '../../Service';
import { cx } from './Tkb';

interface item {
    id: string;
    name: string;
    mhp: string;
}

export function AddHp({ data, onAddHp, maHocPhans }: { data?: DsNhomHocResp; onAddHp?: (maHocPhan: string) => void; maHocPhans?: string[] }) {
    const [search, setSearch] = useState('');
    const [searchBy, setSearchBy] = useState<string>('mon');

    const [searchResult, setSearchResult] = useState<item[]>([]);

    const searchRef = useRef<MiniSearch>(
        new MiniSearch<item>({
            fields: ['name', 'mhp'],
        }),
    );

    useEffect(() => {
        if (!data?.ds_mon_hoc) return;
        const listMonHoc = Object.keys(data.ds_mon_hoc).map((key) => {
            return {
                id: key,
                name: data?.ds_mon_hoc[key],
                mhp: key,
            };
        });

        listMonHoc.forEach((e) => {
            if (!searchRef.current.has(e.id)) searchRef.current.add(e);
        });
        // searchRef.current.addAll(listMonHoc);
    }, [data]);

    useEffect(() => {
        const searchResultTemp = searchRef.current.search(search, { prefix: true, fuzzy: 0.4 });

        if (!data?.ds_mon_hoc) return;

        let result = [];
        if (searchResultTemp.length) {
            result = searchResultTemp.map((result) => {
                const monhoc = data.ds_mon_hoc[result.id];
                return {
                    id: result.id,
                    name: monhoc,
                    mhp: result.id,
                };
            });
        } else {
            result = Object.keys(data.ds_mon_hoc).map((key) => {
                return {
                    id: key,
                    name: data?.ds_mon_hoc[key],
                    mhp: key,
                };
            });
        }
        setSearchResult(result);
    }, [data, search]);

    return (
        <div className={cx('add-popup')}>
            <div className={cx('header')}>
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." />
                {/* <button className={cx('filter')}>Bộ Lọc</button> */}
                <select className={cx('filter')} value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value={'mon'}>Lọc theo môn</option>
                    <option value={'lop'}>Lọc theo lớp</option>
                    <option value={'khoa'}>Lọc theo khoa</option>
                </select>
            </div>

            <div className={cx('body')}>
                <div className={cx('relust')}>
                    {searchResult.map((e) => {
                        return (
                            <label className={cx('monhoc')} key={e.mhp}>
                                <input
                                    type="checkbox"
                                    checked={maHocPhans?.includes(e.mhp)}
                                    onChange={() => {
                                        if (onAddHp) onAddHp(e.mhp);
                                    }}
                                />
                                <div className={cx('ten')}>{e.name}</div>
                                <div className={cx('more-info')}>{e.mhp}</div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
