import { createBrowserRouter } from 'react-router-dom';

import { DefaultLayout } from '../components/Layout';
import Home from '../pages/Home';
import DsTkb from '../pages/DsTkb';
import ErrorPage from '../pages/Error';
import routersConfig from '../config/routers';
import Tkb from '../pages/Tkb';
import Test from '../pages/Test/Test';
import LoginUp from '../pages/LoginUp';

const routers = createBrowserRouter([
    {
        path: routersConfig.home,
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: routersConfig.tkbs,
                element: <DsTkb />,
            },
            {
                path: routersConfig.tkb,
                element: <Tkb />,
            },
            {
                path: routersConfig.test,
                element: <Test />,
            },
        ],
    },
    {
        path: routersConfig.logInUp,
        element: <LoginUp />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default routers;
