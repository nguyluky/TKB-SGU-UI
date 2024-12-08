import classNames from 'classnames/bind';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import globalContent, { UserInfoType } from '../../store/GlobalContent/Content';
import styles from './MemberVIew.module.scss';

const cx = classNames.bind(styles);

export default function MemberView({ userIds }: { userIds: string[] }) {
    const [globalState] = useContext(globalContent);

    const [userInfo, setUserInfo] = useState<{ [Key: string]: UserInfoType }>({});

    useEffect(() => {
        console.log(userIds);

        const fleeAllUserInfo = userIds.map(async (userId) => {
            if (userInfo[userId]) return userInfo[userId];
            const res = await globalState.client.serverApi.getUserInfoAsQuest(userId);
            return res.data;
        });

        Promise.all(fleeAllUserInfo).then((res) => {
            const data: { [Key: string]: UserInfoType } = {};
            res.forEach((e, index) => {
                if (!e) return;
                if (e.id === globalState.userInfo?.id) return;
                data[userIds[index]] = e;
            });
            setUserInfo(data);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalState.client.serverApi, userIds]);

    return userIds.length === 0 ? (
        <></>
    ) : (
        <div className={cx('wrapper')}>
            <div className={cx('userAvt')}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
            {Object.values(userInfo).map((e, index) => (
                <div className={cx('userAvt')} key={e.id}>
                    <img src={e.avt} referrerPolicy="no-referrer" alt={'user: ' + index} />
                </div>
            ))}
        </div>
    );
}
