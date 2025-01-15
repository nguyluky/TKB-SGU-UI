import { ReactElement, useState } from 'react';
import callbackContent, { initValue } from './Content';

function Provider({ children }: { children: ReactElement }) {
    const [state, setState] = useState(initValue);

    return <callbackContent.Provider value={[state, setState]}>{children}</callbackContent.Provider>;
}

export default Provider;
