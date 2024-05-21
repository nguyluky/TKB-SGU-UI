import React, { useContext } from 'react';
import './UserInfo.scss';
import Context from '~/store/Context';

function UserInfo({ onHide }) {
    const [state, dispath] = useContext(Context);

    console.log(state);

    const handleLogOut = () => {
        onHide();
        window.localStorage.clear();
        dispath({ type: 'SET-USER', value: null });
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
