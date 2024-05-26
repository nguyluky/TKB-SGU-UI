import React, { useContext, useEffect } from 'react';

import './DsTkb.scss';
import Context from '~/store/GlobalStore/Context';
import Card from './Card';
import Loading3 from '../Loading/Loading3';
import { useLoaderData } from 'react-router-dom';
import TkbSguApi from '~/api/Api';

function FileNoFound() {
    return (
        <div className="file-no-found">
            <div className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 11.2547C21.396 10.8334 20.7224 10.5049 20 10.2899V7H11.5858L9.58579 5H4V19H11.2899C11.5049 19.7224 11.8334 20.396 12.2547 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H10.4142L12.4142 5H21C21.5523 5 22 5.44772 22 6V11.2547ZM18 22C15.2386 22 13 19.7614 13 17C13 14.2386 15.2386 12 18 12C20.7614 12 23 14.2386 23 17C23 19.7614 20.7614 22 18 22ZM16.7066 19.7076C17.0982 19.895 17.5369 20 18 20C19.6569 20 21 18.6569 21 17C21 16.5369 20.895 16.0982 20.7076 15.7066L16.7066 19.7076ZM15.2924 18.2934L19.2934 14.2924C18.9018 14.105 18.4631 14 18 14C16.3431 14 15 15.3431 15 17C15 17.4631 15.105 17.9018 15.2924 18.2934Z"></path>
                </svg>
            </div>

            <span>Không tìm thấy thời khoá biểu nào!</span>
        </div>
    );
}

function DsTkb() {
    const [state, dispath] = useContext(Context);

    useEffect(() => {
        state.topbar.left = <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>;
        dispath({ path: 'topbar', value: state.topbar });
        state.user?.getDsTkb().then((resp) => {
            dispath({ path: 'tkbs', value: resp.data });
        });
    }, []);

    return (
        <div className="ds-tkbs-body">
            <div className="tkbs-start-wall">
                <div className="tkbs-start center">
                    <div className="header">
                        <p>Bắt đầu thời khóa biểu mới</p>
                        <div className="tool">
                            <span>
                                <box-icon name="dots-vertical-rounded"></box-icon>
                            </span>
                        </div>
                    </div>
                    <div className="start-list">
                        <Card name={'Tạo mới'}>
                            <div className="add">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <linearGradient id="grad1" x1="0%" x2="100%" y1="0%" y2="0%">
                                        <stop offset="0%" stopColor="#D16BA5" />
                                        <stop offset="50%" stopColor="#86A8E7" />
                                        <stop offset="100%" stopColor="#5FFBF1" />
                                    </linearGradient>
                                    <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" fill="url(#grad1)"></path>
                                </svg>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="tkbs-save-wall">
                <div className="tkbs-save center">
                    <div className="header">
                        <p>Thời khóa biểu đã lưu</p>
                        <div className="tool">
                            <span>
                                <box-icon type="solid" name="grid"></box-icon>
                            </span>
                        </div>
                    </div>
                    <div className="save-list-wall">
                        <div className="save-list">
                            {state.user?.token ? (
                                state.tkbs ? (
                                    state.tkbs?.length ? (
                                        state.tkbs.map((e, i) => {
                                            // console.log(e);
                                            return <Card name={e.name} des={e.tkb_describe} link={e.id} key={i} />;
                                        })
                                    ) : (
                                        <FileNoFound />
                                    )
                                ) : (
                                    <div className="loading">
                                        <Loading3 />
                                    </div>
                                )
                            ) : (
                                <FileNoFound />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DsTkb;
