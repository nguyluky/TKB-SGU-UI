import React, { useCallback, useContext, useEffect } from 'react';

import './Home.scss';
import { Link } from 'react-router-dom';
import { globalContext } from '~/store/GlobalStore';

function Home() {
    const [state, dispath] = useContext(globalContext);

    useEffect(() => {
        state.topbar.left = <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>;
        dispath({ path: 'topbar', value: state.topbar });
    }, []);

    return (
        <>
            <div className="home-body">
                <p style={{ color: 'var(--text-color)' }}>chưa làm</p>
                <Link to="/tkbs">Truy cập</Link>
            </div>
        </>
    );
}

export default Home;
