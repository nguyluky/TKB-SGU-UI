import React from 'react';

import TopBar from '~/components/TopBar';
import tkbContext from './Context';
import reducre, { initValue } from './reducer';

function Tkbs() {
    const [state, dispath] = React.useReducer(reducre, initValue);

    return (
        <tkbContext.Provider value={[state, dispath]}>
            <TopBar></TopBar>
        </tkbContext.Provider>
    );
}

export { tkbContext, reducre as tkbReducre, initValue as tkbInitValue };
export default Tkbs;
