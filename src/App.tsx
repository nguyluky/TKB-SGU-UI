import { RouterProvider } from 'react-router-dom';
import routers from './routes';
import { Client } from './Service';
import 'reactjs-popup/dist/index.css';
import { globalContent } from './store/GlobalContent';
import { useContext, useEffect } from 'react';

const client = new Client('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NjNmNDc1MC1iMjQ2LTQzNDYtOWZjYi02MzU3YjBmZjA1YWYiLCJpYXQiOjE3MTY5NTA3ODZ9.OTyZQVQJEpyjNrSghM49cZGiVkU5ImWTMEC8v68vY_g');

function App() {
    const [globalState, setGlobalState] = useContext(globalContent);

    useEffect(() => {
        window.document?.querySelector('html')?.setAttribute('theme', globalState?.theme || 'light');
    }, [globalState?.theme]);

    return <RouterProvider router={routers} />;
}

export default App;
