import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useContext, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import { PopupProps } from 'reactjs-popup/dist/types';
import notifyMaster from '../../../components/NotifyPopup/NotificationManager';
import PopupModel from '../../../components/PopupModel';
import { globalContent } from '../../../store/GlobalContent';

import style from './PagesPopup.module.scss';

const cx = classNames.bind(style);

interface SharePopupProps extends Omit<PopupProps, 'children'> {
    tkbid: string;
}

export default function Share({ tkbid, ...pros }: SharePopupProps) {
    // const [pos, setPos] = useState('read');
    const [globalState] = useContext(globalContent);

    const [link, setLine] = useState('Đang lấy');

    const copyHandel = () => {
        navigator.clipboard.writeText(`${window.location.origin}/join/${link}`).then(() => {
            notifyMaster.success('Copy thành công');
        });
    };

    useEffect(() => {
        globalState.client.serverApi.createInviteLink(tkbid).then((e) => {
            if (!e.success) {
                notifyMaster.error(e.msg);
                return;
            }
            setLine(e.data || '');
        });
    }, [globalState.client.serverApi, tkbid]);

    return (
        <Popup {...pros}>
            <PopupModel title="Tại lời mời" onCancel={pros.onClose} noFooter>
                <div className={cx('input')}>
                    <label>link: </label>
                    <div className={cx('input-copy')}>
                        <p>
                            {window.location.origin}/join/{link}
                        </p>
                        <button className={cx('button-copy')} onClick={copyHandel}>
                            <FontAwesomeIcon icon={faCopy} />
                        </button>
                    </div>
                </div>
            </PopupModel>
        </Popup>
    );
}
