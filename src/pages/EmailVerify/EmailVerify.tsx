import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { globalContent } from '../../store/GlobalContent';

export default function EmailVerify() {
    const nav = useNavigate();

    const [globalState] = useContext(globalContent);

    const { token } = useParams();

    useEffect(() => {
        console.log(token);
        globalState.client.serverApi.emailVerify(token || '').then((e) => {
            // TODO: Handle the response
            // FUCKKKKKKKKKKKKKKKKKKKKKKKKKK
        });
    }, [token]);

    return <p></p>;
}
