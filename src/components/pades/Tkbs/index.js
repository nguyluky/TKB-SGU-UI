import React from 'react';

import TopBar from '~/components/TopBar';
import tkbContext from './Context';
import reducre, { initValue } from './reducer';
import DsTkb from '~/components/DsTkb';

function Tkbs() {
    const [state, dispath] = React.useReducer(reducre, initValue);

    return (
        <tkbContext.Provider value={[state, dispath]}>
            <TopBar>
                <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>TKB SGU</p>
            </TopBar>
            <DsTkb />
        </tkbContext.Provider>
    );
}

export { tkbContext, reducre as tkbReducre, initValue as tkbInitValue };
export default Tkbs;
