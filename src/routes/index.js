import Home from '~/components/pades/Home';
import Signup from '~/components/pades/Signup';
import Signin from '~/components/pades/Signin';
import Tkbs from '~/components/pades/Tkbs';
import { createBrowserRouter } from 'react-router-dom';

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/tkbs/*', element: Tkbs },
    { path: '/sign_in', element: () => <Signup isSignIn={true} /> },
    { path: '/sign_in/forget_password', element: () => <h1>forget_password</h1> },
    { path: '/sign_up', element: () => <Signup isSignIn={false} /> },
];

// const newpublicRoutes = createBrowserRouter([
//     {
//         path: '/',
//         element: <Home />
//     },
//     {
//         path:
//     }
// ])

const privateRoutes = [];

export { publicRoutes, privateRoutes };
