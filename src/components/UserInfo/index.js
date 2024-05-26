import React, { useContext } from 'react';
import './UserInfo.scss';
import Context from '~/store/GlobalStore/Context';

function UserInfo({ onHide }) {
    const [state, dispath] = useContext(Context);

    const handleLogOut = () => {
        onHide();
        localStorage.removeItem('token');
        state.user.token = '';
        dispath({ path: 'user', value: state.user });
        dispath({ path: 'currTkb', value: null });
        dispath({ path: 'mahp_idtohoc', value: {} });
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
