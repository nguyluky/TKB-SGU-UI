import Home from '~/components/pades/Home';
import Tkb from '~/components/pades/Tkb';
import Signup from '~/components/pades/Signup';
import Signin from '~/components/pades/Signin';

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/tkbs/:tkbid', element: Tkb },
    { path: '/sign_in', element: Signin },
    { path: '/sign_in/forget_password', element: () => <h1>forget_password</h1> },
    { path: '/sign_up', element: Signup },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
