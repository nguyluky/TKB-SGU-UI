import Home from '~/components/pades/Home';
import Auth from '~/components/pades/Auth';
import Tkbs from '~/components/pades/Tkbs';
import { createBrowserRouter } from 'react-router-dom';
import DsTkb from '~/components/DsTkb';
import TkbBody from '~/components/TkbBody';
import SignIn from '~/components/SignIn';
import SignUp from '~/components/SignUp';

const publicRoutes = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/auth',
        element: <Auth />,
        children: [
            {
                path: 'signin',
                element: <SignIn />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
        ],
    },
    {
        path: '/tkbs',
        element: <Tkbs />,
        children: [
            {
                index: true,
                element: <DsTkb />,
            },
            {
                path: 'edit/:tkbid',
                element: <TkbBody />,
            },
        ],
    },
]);

const privateRoutes = [];

export { publicRoutes, privateRoutes };
