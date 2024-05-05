import React from 'react';
import TopBar from '~/components/TopBar';

function Home() {
    return (
        <>
            <TopBar>
                <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>
            </TopBar>
        </>
    );
}

export default Home;
