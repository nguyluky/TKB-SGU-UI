import React, { useContext } from 'react';
import './UserInfo.scss';
import Context from '~/store/Context';
import { tkbContext } from '../pades/Tkbs';

function UserInfo({ onHide }) {
    const [state, dispath] = useContext(Context);
    // eslint-disable-next-line no-unused-vars
    const [tkbState, tkbDispath] = useContext(tkbContext);
    console.log(state);

    const handleLogOut = () => {
        onHide();
        localStorage.removeItem('token');
        dispath({ type: 'SET-USER', value: null });
        tkbDispath({ path: 'currTkb', value: null });
        tkbDispath({ path: 'mahp_idtohoc', value: {} });
    };

    return (
        <div className="user_info">
            <div className="line" onClick={handleLogOut}>
                <box-icon name="log-out"></box-icon>
                <span>Đăng xuất</span>
            </div>
        </div>
    );
}

export default UserInfo;
