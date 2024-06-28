import classNames from 'classnames/bind';

import { faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Error.module.scss';

const cx = classNames.bind(style);

function Error({ msg }: { msg?: string }) {
    return (
        <div className={cx('wrapper')}>
            <FontAwesomeIcon icon={faLinkSlash} size="5x" />
            <div>
                <h1>{msg ? msg : 'Page not found'}</h1>
                <p>go to home page</p>
            </div>
        </div>
    );
}

export default Error;
