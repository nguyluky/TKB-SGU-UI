import React, { useContext, useEffect } from 'react';

import './DsTkb.scss';
import Context from '~/store/Context';
import { tkbContext } from '../pades/Tkbs';
import Loading2 from '../Loading/Loading2';
import Card from './Card';

function DsTkb() {
    const [state] = useContext(Context);
    const [tkbState, tkbDispath] = useContext(tkbContext);

    useEffect(() => {
        if (state.user?.token) {
            state.user.getDsTkb().then((res) => {
                if (res.success) {
                    tkbDispath({ path: 'tkbs', value: res.data });
                }
            });
        }
    }, [state.user, tkbDispath]);

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
                                tkbState.tkbs ? (
                                    tkbState.tkbs?.length ? (
                                        tkbState.tkbs.map((e, i) => {
                                            // console.log(e);
                                            return <Card name={e.name} des={e.tkb_describe} link={e.id} key={i} />;
                                        })
                                    ) : (
                                        <p>không có tkb nào</p>
                                    )
                                ) : (
                                    <div className="loading">
                                        <Loading2 />
                                    </div>
                                )
                            ) : (
                                <p>Chưa đăng nhập</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DsTkb;
