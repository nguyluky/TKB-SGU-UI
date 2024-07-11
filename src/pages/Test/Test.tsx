import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import ButtonWithLoading from '../../components/ButtonWithLoading';
import Input from '../../components/Input';
import PopupModel from '../../components/PopupModel';
import { routerConfig } from '../../config';

function Test() {
    const [changePasswordShow, setChangePasswordShow] = useState(false);

    return (
        <div>
            <Popup open={true}>
                <PopupModel
                    noFooter
                    title=""
                    onCancel={() => {
                        console.log('ok');
                    }}
                >
                    <Input autoComplete="off" title="User Name" type="text" icon={faUser} />
                    <Input autoComplete="off" title="Password" type="password" icon={faLock} />
                    <a href={routerConfig.forgotPassword}>Quên mật khẩu ?</a>
                    <ButtonWithLoading>Sign In</ButtonWithLoading>
                </PopupModel>
            </Popup>
        </div>
    );
}

export default Test;
