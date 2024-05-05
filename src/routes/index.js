import Home from '~/components/pades/Home';
import Tkb from '~/components/pades/Tkb';

const publicRoutes = [
    { path: '/about', element: Home },
    { path: '/', element: Tkb },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
