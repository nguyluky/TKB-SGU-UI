import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { ReactElement } from 'react';

import style from './PopupModel.module.scss';

const cx = classNames.bind(style);

function Popup({
    children,
    onOk,
    onCancel,
    title,
    noFooter,
}: {
    children: ReactElement | ReactElement[];
    onOk?: Function;
    onCancel?: Function;
    title: string;
    noFooter?: boolean;
}) {
    return (
        <motion.form className={cx('conten-menu-popup')} onSubmit={(e) => e.preventDefault()}>
            <div className={cx('header')}>
                <h2>{title}</h2>
            </div>
            <div className={cx('content')}>{children}</div>

            {!noFooter ? (
                <div className={cx('buttons')}>
                    {onCancel ? (
                        <button className={cx('cancel')} onClick={() => onCancel()} type="button">
                            Huỷ
                        </button>
                    ) : null}
                    {onOk ? (
                        <button className={cx('ok')} type="submit" onClick={() => onOk()}>
                            ok
                        </button>
                    ) : null}
                </div>
            ) : (
                ''
            )}
        </motion.form>
    );
}

export default Popup;
