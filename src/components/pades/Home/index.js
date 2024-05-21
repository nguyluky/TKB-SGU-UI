import React from 'react';

import './Home.scss';
import TopBar from '~/components/TopBar';
import { Link } from 'react-router-dom';

function Home() {
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
