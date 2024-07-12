import { useEffect } from 'react';

function Test2() {
    useEffect(() => {
        console.log('mouse');

        return () => {
            console.log('unmouse');
        };
    }, []);

    return <div>test2</div>;
}

function Test() {
    var a = <Test2 />;
    return <div>{a}</div>;
}

export default Test;
