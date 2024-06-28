import { useContext, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import 'reactjs-popup/dist/index.css';

import routers from './routes';
import { globalContent } from './store/GlobalContent';

function App() {
    const [globalState] = useContext(globalContent);

    useEffect(() => {
        window.document
            ?.querySelector('html')
            ?.setAttribute('theme', globalState?.theme || 'light');
    }, [globalState?.theme]);

    return <RouterProvider router={routers} />;
}

export default App;
