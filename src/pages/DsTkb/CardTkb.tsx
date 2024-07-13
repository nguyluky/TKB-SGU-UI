import { faCloud, faEllipsisVertical, faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'reactjs-popup';

import { TkbData } from '../../Service';
import images from '../../assets/images';
import PopupModel from '../../components/PopupModel';
import { cx } from './DsTkb';

export function CardTkb({
    data,
    onRename,
    onDelete,
    isRow,
}: {
    data: TkbData;
    isRow: boolean;
    onRename: (tkbData: TkbData, newName: string) => void;
    onDelete: (tkbData: TkbData) => void;
}) {
    const nati = useNavigate();

    const [renamePopup, setRenamePopup] = useState(false);
    const [deletePopup, setDeletePopup] = useState(false);

    const [lastName, setLastName] = useState(data.name);

    const deleteHandle = () => {
        onDelete(data);
        setDeletePopup(false);
    };

    const renameHandle = () => {
        onRename(data, lastName);
        setRenamePopup(false);
    };

    return (
        <div
            className={cx('card', {
                row: isRow,
            })}
            onClick={() => {
                nati(data.id + (data.isClient ? '?isclient=true' : ''));
            }}
        >
            <div className={cx('thumbnail')}>
                <div className={cx('icon-wrapper')}>
                    {data.thumbnails ? (
                        <p>imge</p>
                    ) : (
                        <img src={images.missingPicture} alt="Missing" />
                    )}
                </div>
            </div>
            <div className={cx('body')}>
                <div className={cx('info')}>
                    <p className={cx('name')}>{data.name}</p>
                    <p className={cx('date')}>
                        <FontAwesomeIcon icon={data.isClient ? faFolder : faCloud} />
                        <span>{data.created.toLocaleDateString('en-US')}</span>
                    </p>
                </div>

                {/* NOTE: popup rename*/}
                <Popup open={renamePopup} onClose={() => setRenamePopup(false)}>
                    <PopupModel
                        title="Rename Tkb"
                        onCancel={() => {
                            setRenamePopup(false);
                        }}
                        onOk={renameHandle}
                    >
                        <div className={cx('input')}>
                            <label form="inputname">New Name: </label>
                            <input
                                type="text"
                                name="inputname"
                                value={lastName}
                                onChange={(event) => setLastName(event.target.value)}
                            />
                        </div>
                    </PopupModel>
                </Popup>

                {/* Popup delete */}
                <Popup open={deletePopup} onClose={() => setDeletePopup(false)}>
                    <PopupModel
                        title="Delete Thời Khóa Biểu"
                        onCancel={() => setDeletePopup(false)}
                        onOk={deleteHandle}
                    >
                        <p>Bạn có chắc chắn là muốn xóa cái này không!!</p>
                    </PopupModel>
                </Popup>

                <Popup
                    arrow={false}
                    trigger={
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faEllipsisVertical} />
                        </div>
                    }
                    position={'right bottom'}
                >
                    <div className={cx('content-menu')}>
                        <span
                            className={cx('item')}
                            onClick={() => {
                                window.open(
                                    window.location.origin +
                                        '/tkbs/' +
                                        data.id +
                                        (data.isClient ? '?isclient=true' : ''),
                                );
                            }}
                        >
                            Mở ở thẻ mới
                        </span>
                        <span
                            className={cx('item')}
                            onClick={() => {
                                setRenamePopup(true);
                                setLastName(data.name);
                            }}
                        >
                            Đổi tên
                        </span>
                        <span className={cx('item')} onClick={() => setDeletePopup(true)}>
                            Xóa
                        </span>
                    </div>
                </Popup>
            </div>
        </div>
    );
}
