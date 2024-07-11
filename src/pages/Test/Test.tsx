import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import Input from '../../components/Input';
import PopupModel from '../../components/PopupModel';

function Test() {
    const [changePasswordShow, setChangePasswordShow] = useState(false);

    return (
        <div>
            <Popup open={true}>
                <PopupModel
                    title="Đổi mật khẩu"
                    onCancel={() => {
                        console.log('ok');
                    }}
                >
                    <Input
                        className="line"
                        autoComplete="off"
                        title="Mật khẩu hiện tại"
                        type="password"
                        icon={faUser}
                    />
                    <Input
                        autoComplete="off"
                        title="Mật khẩu mới"
                        type="password"
                        icon={faLock}
                        className="line"
                    />
                    <Input
                        autoComplete="off"
                        title="Xác nhận mật khẩu"
                        type="password"
                        icon={faLock}
                        className="line"
                    />
                </PopupModel>
            </Popup>
        </div>
    );
}

export default Test;
