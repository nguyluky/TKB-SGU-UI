import classNames from 'classnames/bind';
import MiniSearch from 'minisearch';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { DsNhomHocResp } from '../../Service';
import style from './AddHp.module.scss';

const cx = classNames.bind(style);

interface item {
    id: string;
    name: string;
    mhp: string;
    ds_lop: string[];
    ds_khoa: string[];
}

export function AddHp({
    data,
    onAddHp,
    maHocPhans,
}: {
    data?: DsNhomHocResp;
    onAddHp?: (maHocPhan: string) => void;
    maHocPhans?: string[];
}) {
    const [search, setSearch] = useState('');
    const [supSearch, setSupSearch] = useState('');
    const [searchBy, setSearchBy] = useState<string>('mon');

    const [searchResult, setSearchResult] = useState<item[]>([]);
    const [filters, setFilters] = useState<{ id: string; display_name: string }[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string[]>([]);

    const searchRef = useRef<MiniSearch<item>>(
        new MiniSearch<item>({
            fields: ['name', 'mhp'],
            storeFields: ['ds_lop', 'ds_khoa'],
        })
    );
    const supFilter = useRef<MiniSearch>(
        new MiniSearch<{ id: string; display_name: string }>({
            fields: ['display_name', 'id'],
        })
    );

    useEffect(() => {
        if (!data?.ds_mon_hoc) return;
        const listMonHoc = data.ds_mon_hoc.map((e) => {
            return {
                id: e.id,
                name: e.display_name,
                mhp: e.id,
                ds_lop: e.ds_lop || [],
                ds_khoa: e.ds_khoa || [],
            };
        });

        listMonHoc.forEach((e) => {
            if (!searchRef.current.has(e.id)) searchRef.current.add(e);
        });
    }, [data]);

    useEffect(() => {
        const searchResultTemp = searchRef.current.search(search, {
            prefix: true,
            fuzzy: 0.4,
        });

        console.log(searchResultTemp);

        let result = [];
        if (searchResultTemp.length) {
            result = searchResultTemp.map((result) => {
                const monhoc = data?.ds_mon_hoc.find((e) => e.id === result.id);
                return {
                    id: result.id,
                    name: monhoc?.display_name || '',
                    mhp: result.id,
                    ds_lop: monhoc?.ds_lop || [],
                    ds_khoa: monhoc?.ds_khoa || [],
                };
            });
        } else {
            if (!data?.ds_mon_hoc) return;
            result = data.ds_mon_hoc.map((e) => {
                return {
                    id: e.id,
                    name: e.display_name,
                    mhp: e.id,
                    ds_lop: e.ds_lop || [],
                    ds_khoa: e.ds_khoa || [],
                };
            });
        }
        setSearchResult(
            result.filter((e) => {
                console.log(e);
                if (selectedFilter.length === 0) return true;
                if (searchBy === 'lop') return (e.ds_lop as string[]).some((lop) => selectedFilter.includes(lop));
                if (searchBy === 'khoa') return (e.ds_khoa as string[]).some((khoa) => selectedFilter.includes(khoa));
                return true;
            })
        );
    }, [data, search, searchBy, selectedFilter]);

    useEffect(() => {
        if (!data) return;

        const data_ = searchBy === 'lop' ? data.ds_lop : data.ds_khoa;
        if (supSearch === '') {
            setFilters(data_);
            return;
        }

        const result = supFilter.current.search(supSearch, { prefix: true, fuzzy: 0.4 });

        setFilters(
            result.map((e) => {
                return data_.find((d) => d.id === e.id) || { id: e.id, display_name: e.display_name };
            })
        );
    }, [data, searchBy, supSearch]);

    const changeFilter = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedFilter([]);
        if (!data) return;
        if (value === 'lop') {
            setFilters(data.ds_lop);
            supFilter.current.removeAll();
            data.ds_lop.forEach((e) => {
                supFilter.current.add(e);
            });
        } else if (value === 'khoa') {
            setFilters(data.ds_khoa);
            supFilter.current.removeAll();
            data.ds_khoa.forEach((e) => {
                supFilter.current.add(e);
            });
        } else {
            setFilters([]);
        }

        setSearchBy(value);
    };

    return (
        <div className={cx('add-popup')}>
            <div className={cx('split', 'sup-filter', { hide: !['lop', 'khoa'].includes(searchBy) })}>
                <div className={cx('header')}>
                    <input
                        type="text"
                        value={supSearch}
                        onChange={(e) => setSupSearch(e.target.value)}
                        placeholder="Search..."
                    />
                </div>
                <div className={cx('body')}>
                    <div className={cx('relust')}>
                        {filters.map((e) => {
                            return (
                                <label className={cx('monhoc')} key={e.display_name}>
                                    <input
                                        type="checkbox"
                                        checked={selectedFilter.includes(e.id)}
                                        onChange={() => {
                                            if (selectedFilter.includes(e.id)) {
                                                setSelectedFilter(selectedFilter.filter((id) => id !== e.id));
                                            } else {
                                                setSelectedFilter([...selectedFilter, e.id]);
                                            }
                                        }}
                                    />
                                    <div className={cx('ten')}>{e.display_name}</div>
                                    <div className={cx('more-info')}>Mã: {e.id}</div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className={cx('split')}>
                <div className={cx('header')}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                    />
                    {/* <button className={cx('filter')}>Bộ Lọc</button> */}
                    <select className={cx('filter')} value={searchBy} onChange={changeFilter}>
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
                                    <div className={cx('more-info')}>Mã môn: {e.mhp}</div>
                                    <div className={cx('more-info')}>
                                        Khoa: {e.ds_khoa.join(', ') ?? '??'} | Lớp: {e.ds_lop.join(', ') ?? '??'}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
