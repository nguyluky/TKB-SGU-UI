import { ReactElement, useState } from 'react';
import globalContent, { initValue } from './Content';

function Provider({ children }: { children: ReactElement }) {
    const [state, setState] = useState(initValue);

    return <globalContent.Provider value={[state, setState]}>{children}</globalContent.Provider>;
}

export default Provider;
