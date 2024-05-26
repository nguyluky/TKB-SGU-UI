import React from 'react'; // nạp thư viện react
import { RouterProvider } from 'react-router-dom';

import { publicRoutes } from './routes';
import storeContext from './store/GlobalStore/Context';
import { setTheme } from './components/GlobalStyles';
// import { UserApi } from './api/Api';

function App() {
    const [state] = React.useContext(storeContext);

    console.log('reloat');

    React.useEffect(() => {
        setTheme(state.theme);
    }, [state.theme]);

    return <RouterProvider router={publicRoutes} />;
}

export default App;
