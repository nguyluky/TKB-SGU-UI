import { useContext, useEffect } from 'react';
import { globalContent } from '../store/GlobalContent';



export default function useTkbSocket() {
    const [globalState] = useContext(globalContent);

    useEffect(() => {
        if (!globalState.client.islogin()) return;

        
    }, [globalState.client]);
}