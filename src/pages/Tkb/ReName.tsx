import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { cx } from './Tkb';

export function ReName({ defaultName }: { defaultName: string }) {
    const [name, setName] = useState(defaultName);

    return (
        <div className={cx('rename-header')}>
            <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
            <FontAwesomeIcon icon={faPenToSquare} />
        </div>
    );
}
