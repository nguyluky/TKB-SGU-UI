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
    const { icon, title, type, className, ...prop } = props;

    const [showPass, setShowPass] = useState(false);
    return (
        <label className={cx('ct-input', className)}>
            <div className={cx('input-icon-wrapper')}>
                <FontAwesomeIcon icon={icon} />
                <input {...prop} type={showPass ? 'text' : type} required />

                {type === 'password' ? (
                    <FontAwesomeIcon
                        icon={showPass ? faEye : faEyeSlash}
                        onClick={() => setShowPass((e) => !e)}
                    />
                ) : (
                    ''
                )}
            </div>
            <p className={cx('title')}>{title}</p>
        </label>
    );
}

export default Input;
