import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useState } from 'react';
import style from './Input.module.scss';

const cx = classNames.bind(style);

interface Prop
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    icon: IconProp;
    title: string;
}

function Input(props: Prop) {
    const { icon, title, type, ...prop } = props;

    const [showPass, setShowPass] = useState(false);

    return (
        <label className={cx('ct-input')}>
            <p className={cx('title')}>{title}</p>
            <FontAwesomeIcon icon={icon} />
            <input {...prop} type={showPass ? 'text' : type} />

            {type === 'password' ? (
                <FontAwesomeIcon
                    icon={showPass ? faEye : faEyeSlash}
                    onClick={() => setShowPass((e) => !e)}
                />
            ) : (
                ''
            )}
        </label>
    );
}

export default Input;
