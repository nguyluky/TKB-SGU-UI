import { createBrowserRouter } from 'react-router-dom';

import Home from '~/components/pades/Home';
import Auth from '~/components/pades/Auth';
import Tkbs from '~/components/pades/Tkbs';
import DsTkb from '~/components/DsTkb';
import TkbBody from '~/components/TkbBody';
import SignIn from '~/components/SignIn';
import SignUp from '~/components/SignUp';

import { initValue } from '~/store/reducer';
import TkbSguApi from '~/api/Api';

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
        loader: async () => {
            var resp = await TkbSguApi.getDsNhomHoc();

            return { resp };
        },
        children: [
            {
                index: true,
                element: <DsTkb />,
            },
            {
                path: 'edit/:tkbid',
                loader: async ({ params }) => {
                    var { tkbid } = params;

                    if (!tkbid || tkbid === 'new') return {};
                    var tkb = await initValue.user?.getTkb(tkbid);

                    console.log(tkb);
                    return { tkb };
                },
                element: <TkbBody />,
            },
        ],
    },
]);

const privateRoutes = [];

export { publicRoutes, privateRoutes };
