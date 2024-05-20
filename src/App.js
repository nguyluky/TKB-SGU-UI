import React from 'react'; // nạp thư viện react
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { publicRoutes } from './routes';
import storeContext from './store/Context';
import Tkb from './components/pades/Tkb';

function App() {
    const [state, dispath] = React.useContext(storeContext);

    React.useEffect(() => {
        if (state.theme) document.body.className = 'dark-mode';
    }, []);

    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                var Page = route.element;
                return <Route key={index} path={route.path} element={<Page />} />;
            })}
        </Routes>
    );
}

export default App;
