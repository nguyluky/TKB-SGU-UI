import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { createRef } from 'react';
import { AuthLayout, DefaultLayout } from '../components/Layout';
import { routerConfig } from '../config';
import ChangePassword from '../pages/ChangePassword';
import DsTkb from '../pages/DsTkb';
import ErrorPage from '../pages/Error';
import Home from '../pages/Home';
import Join from '../pages/Join';
import Test from '../pages/Test/Test';
import Tkb from '../pages/Tkb';

export const defaultLayoutChildren = [
    {
        path: '/',
        element: <Home />,
        nodeRef: createRef<HTMLDivElement>(),
    },
    {
        path: routerConfig.tkbs,
        element: <DsTkb />,
        nodeRef: createRef<HTMLDivElement>(),
    },
    {
        path: routerConfig.tkb,
        element: <Tkb />,
        nodeRef: createRef<HTMLDivElement>(),
    },
    {
        path: routerConfig.test,
        element: <Test />,
        nodeRef: createRef<HTMLDivElement>(),
    },
    {
        path: routerConfig.join,
        element: <Join />,
        nodeRef: createRef<HTMLDivElement>(),
    },
];

const routers = createBrowserRouter([
    {
        path: routerConfig.home,
        element: <DefaultLayout />,
        children: defaultLayoutChildren.map<RouteObject>((route) => {
            const temp: RouteObject = {
                index: route.path === '/',
                path: route.path === '/' ? undefined : route.path,
                element: route.element,
            };

            return temp;
        }),
    },
    {
        path: routerConfig.changePassword,
        element: (
            <AuthLayout>
                <ChangePassword />
            </AuthLayout>
        ),
    },
    // {
    //     path: routerConfig.logInUp,
    //     element: (
    //         <AuthLayout>
    //             <LoginUp />
    //         </AuthLayout>
    //     ),
    // },
    {
        path: routerConfig.errorPage,
        element: <ErrorPage />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
]);

export default routers;
