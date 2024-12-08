import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import style from './Footer.module.scss';

const cx = classNames.bind(style);

export default function Footer() {
    return (
        <footer className={cx('footer')}>
            <div>
                <h3> Tác giả: nguyluky</h3>
            </div>

            <div>
                <h3>Theo dõi chúng tôi:</h3>

                <div className={cx('icon-wrapper')}>
                    <FontAwesomeIcon
                        icon={faDiscord}
                        onClick={() => {
                            window.open('https://discord.gg/gVdV6UJRvy');
                        }}
                    />
                </div>
            </div>

            <div>
                <h3>Thông tin liên hệ</h3>

                <p>Email: nguyluky@gmail.com</p>
                <p>
                    facebook: <a href="https://www.facebook.com/profile.php?id=61558476525330">Luky Nguy</a>
                </p>
            </div>
        </footer>
    );
}
