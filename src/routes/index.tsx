import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { createRef } from 'react';
import { DefaultLayout } from '../components/Layout';
import { routerConfig } from '../config';
import Donate from '../pages/Donate';
import DsTkb from '../pages/DsTkb';
import EmailVerify from '../pages/EmailVerify/EmailVerify';
import ErrorPage from '../pages/Error';
import ForgetPassword from '../pages/ForgetPassword';
import Home from '../pages/Home';
import Join from '../pages/Join';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import ResetPassword from '../pages/ResetPasswrord';
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
    {
        path: routerConfig.privacyPolicy,
        element: <PrivacyPolicy />,
        nodeRef: createRef<HTMLDivElement>(),
    },
    {
        path: routerConfig.verifyEmail,
        element: <EmailVerify />,
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
        path: routerConfig.resetPassword,
        element: <ResetPassword />,
    },
    {
        path: routerConfig.forgotPassword,
        element: <ForgetPassword />,
    },
    {
        path: routerConfig.errorPage,
        element: <ErrorPage />,
    },
    {
        path: '*',
        element: <ErrorPage />,
    },
    {
        path: routerConfig.donate,
        element: <Donate></Donate>,
    },
]);

export default routers;
