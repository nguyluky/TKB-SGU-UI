import classNames from 'classnames/bind';
import style from './ButtonWithLoading.module.scss';

const cx = classNames.bind(style);

interface Props
    extends React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    withoutBackground?: boolean;
    isLoading?: boolean;
}

function ButtonWithLoading(props: Props) {
    var { withoutBackground, isLoading, className, disabled, ...props1 } = props;

    return (
        <button
            disabled={disabled || isLoading}
            className={cx('btn', className, {
                nbg: props.withoutBackground,
            })}
            {...props1}
        >
            {isLoading ? (
                <div className={cx('spinner')}>
                    <div className={cx('dot')}></div>
                    <div className={cx('dot')}></div>
                    <div className={cx('dot')}></div>
                    <div className={cx('dot')}></div>
                    <div className={cx('dot')}></div>
                </div>
            ) : (
                ''
            )}
            {props.children}
        </button>
    );
}

export default ButtonWithLoading;
