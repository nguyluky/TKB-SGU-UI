import { createBrowserRouter, RouteObject } from 'react-router-dom';

import { DefaultLayout } from '../components/Layout';
import { routerConfig } from '../config';
import Donate from '../pages/Donate';
// import { DonateQrCode } from '../pages/Donate/DonateQrCode';
import DonateQrCode from '../pages/Donate/DonateQrCode';
import DsTkb from '../pages/DsTkb';
import EmailVerify from '../pages/EmailVerify/EmailVerify';
import ErrorPage from '../pages/Error';
import ForgetPassword from '../pages/ForgetPassword';
import Join from '../pages/Join';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import ResetPassword from '../pages/ResetPasswrord';
import Test from '../pages/Test/Test';
import Tkb from '../pages/Tkb';
import MaintenancePage from '../pages/sr';

export const defaultLayoutChildren = [
    {
        path: '/',
        element: <MaintenancePage />,
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
    {
        path: routerConfig.join,
        element: <Join />,
    },
    {
        path: routerConfig.privacyPolicy,
        element: <PrivacyPolicy />,
    },
    {
        path: routerConfig.verifyEmail,
        element: <EmailVerify />,
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
    {
        path: routerConfig.donateQr,
        element: <DonateQrCode></DonateQrCode>,
    },
]);

export default routers;
