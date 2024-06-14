import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './Input.module.scss';
import { ChangeEventHandler, HTMLInputTypeAttribute, useState } from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import classNames from 'classnames/bind';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

interface Prop extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
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
                <FontAwesomeIcon icon={showPass ? faEye : faEyeSlash} onClick={() => setShowPass((e) => !e)} />
            ) : (
                ''
            )}
        </label>
    );
}

export default Input;
