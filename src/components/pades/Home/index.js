import React, { useCallback, useContext, useEffect } from 'react';

import './Home.scss';
import TopBar from '~/components/TopBar';
import { Link, useNavigate } from 'react-router-dom';
import Context from '~/store/Context';

function Home() {
    const [state, dispath] = useContext(Context);

    const navigate = useNavigate();

    var callback = useCallback(() => {
        navigate('/tkbs');
    }, [navigate]);

    useEffect(() => {
        if (state.user?.token) {
            callback();
        }
    }, [state.user, callback]);

    return (
        <>
            <TopBar>
                <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>
            </TopBar>
            <div className="home-body">
                <p style={{ color: 'var(--text-color)' }}>chưa làm</p>
                <Link to="/tkbs">Truy cập</Link>
            </div>
        </>
    );
}

export default Home;
