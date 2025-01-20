import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

export default function useTkbBeforeunload(tkbIsSave: boolean) {
    const blockEd = useBlocker(({ currentLocation, nextLocation }) => tkbIsSave && currentLocation !== nextLocation);

    useEffect(() => {
        function handleBeforeunload(event: BeforeUnloadEvent) {
            event.returnValue = 'Write something clever here..';
        }

        window.addEventListener('beforeunload', handleBeforeunload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload);
        };
    }, [blockEd]);

    return blockEd;
}
