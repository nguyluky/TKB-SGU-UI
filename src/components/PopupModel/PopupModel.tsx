import classNames from 'classnames/bind';
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
        <form className={cx('conten-menu-popup')}>
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
                        <button className={cx('ok')} onClick={() => onOk()}>
                            ok
                        </button>
                    ) : null}
                </div>
            ) : (
                ''
            )}
        </form>
    );
}

export default Popup;
