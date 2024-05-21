import React from 'react'; // nạp thư viện react
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { publicRoutes } from './routes';
import storeContext from './store/Context';
import { setDarkMode, setLightMode } from './components/GlobalStyles';
// import { UserApi } from './api/Api';

function App() {
    const [state] = React.useContext(storeContext);

    console.log('reloat');

    React.useEffect(() => {
        if (state.theme) setDarkMode();
        else setLightMode();
    }, [state.theme]);

    return (
        <BrowserRouter>
            <Routes>
                {publicRoutes.map((route, index) => {
                    var Page = route.element;
                    return <Route key={index} path={route.path} element={<Page />} />;
                })}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
