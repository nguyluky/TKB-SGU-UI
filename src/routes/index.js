import { createBrowserRouter } from 'react-router-dom';

import Home from '~/components/Home';
import Auth from '~/components/pades/Auth';
import DsTkb from '~/components/DsTkb';
import SignIn from '~/components/SignIn';
import SignUp from '~/components/SignUp';

import MainLayout from '~/components/pades/MainLayout';
import TkbBody from '~/components/TkbBody';
import { initValue } from '~/store/GlobalStore/reducer';
import TkbSguApi from '~/api/Api';
import { useContext } from 'react';
import { globalContext } from '~/store/GlobalStore';

const publicRoutes = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            { index: true, element: <Home /> },
            {
                path: '/tkbs',
                element: <DsTkb />,
            },
            {
                path: '/tkbs/:tkbid',
                loader: async ({ params }) => {
                    var { tkbid } = params;
                    var resp1 = {};
                    if (!initValue.ds_nhom_to) {
                        resp1 = await TkbSguApi.getDsNhomHoc();
                    }

                    if (!tkbid || tkbid === 'new') {
                        return { tkb: initValue.user.createNewTkb(), ...resp1 };
                    }
                    var tkb = await initValue.user?.getTkb(tkbid);

                    return { tkb, ...resp1 };
                },
                element: <TkbBody />,
            },
        ],
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
    // {
    //     path: '/tkbs',
    //     element: <Tkbs />,
    //     loader: async () => {
    //         var resp = await TkbSguApi.getDsNhomHoc();

    //         return { resp };
    //     },
    //     children: [
    //         {
    //             index: true,
    //             element: <DsTkb />,
    //         },
    //         {
    //             path: 'edit/:tkbid',
    //             loader: async ({ params }) => {
    //                 var { tkbid } = params;

    //                 if (!tkbid || tkbid === 'new') return {};
    //                 var tkb = await initValue.user?.getTkb(tkbid);

    //                 console.log(tkb);
    //                 return { tkb };
    //             },
    //             element: <TkbBody />,
    //         },
    //     ],
    // },
]);

const privateRoutes = [];

export { publicRoutes, privateRoutes };
