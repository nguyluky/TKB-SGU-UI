import Context from './Context';
import React, { useReducer } from 'react';
import reducre, { initValue } from './reducer';

function Provider({ children }) {
    const [state, dispath] = useReducer(reducre, initValue);
    return <Context.Provider value={[state, dispath]}>{children}</Context.Provider>;
}

export default Provider;
