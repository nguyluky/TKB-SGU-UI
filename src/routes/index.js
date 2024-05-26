import { createBrowserRouter } from 'react-router-dom';

import Home from '~/components/pades/Home';
import Auth from '~/components/pades/Auth';
import Tkbs from '~/components/pades/Tkbs';
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
        path: '/sign_in',
        element: (
            <Auth>
                <SignIn />
            </Auth>
        ),
    },
    {
        path: '/sign_up',
        element: (
            <Auth>
                <SignUp />
            </Auth>
        ),
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
