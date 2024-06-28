import { createBrowserRouter } from 'react-router-dom';

import { DefaultLayout } from '../components/Layout';
import { routerConfig } from '../config';
import DsTkb from '../pages/DsTkb';
import ErrorPage from '../pages/Error';
import Home from '../pages/Home';
import LoginUp from '../pages/LoginUp';
import Test from '../pages/Test/Test';
import Tkb from '../pages/Tkb';

const routers = createBrowserRouter([
    {
        path: routerConfig.home,
        element: <DefaultLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: routerConfig.tkbs,
                element: <DsTkb />,
            },
            {
                path: routerConfig.tkb,
                element: <Tkb />,
            },
            {
                path: routerConfig.test,
                element: <Test />,
            },
        ],
    },
    {
        path: routerConfig.logInUp,
        element: <LoginUp />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default routers;
