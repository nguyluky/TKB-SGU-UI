import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';

function PopupChangName({ initName, onCancel, onOk }) {
    const [name, setName] = useState(initName);

    return (
        <div className="conten-menu-popup">
            <div className="header">
                <h2>Đổi tên</h2>
            </div>
            <div className="content">
                <p>Vui lòng nhập tên vào mục này:</p>
                <input value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="buttons">
                <button className="cancel" onClick={onCancel}>
                    Huỷ
                </button>
                <button className="ok" onClick={() => onOk(name)}>
                    ok
                </button>
            </div>
        </div>
    );
}

export function Card({ name, des, dateCreated, link, thumbnail, children }) {
    const contextMenuRef = useRef(null);
    const cardRef = useRef(null);

    const [pos, setPos] = useState([0, 0]);

    const [fun, setFun] = useState('');

    const [isMenuShow, setMenuShow] = useState(false);

    const closeModal = () => setFun('');

    useEffect(() => {
        function mouseOnClick(event) {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setMenuShow(false);
            }
        }

        document.addEventListener('mousedown', mouseOnClick);

        return () => {
            document.removeEventListener('mousedown', mouseOnClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contextMenuRef]);

    const changeName = (event) => {
        event.preventDefault();
        setMenuShow(false);
        setFun('rename');
    };

    const deleteTkb = (event) => {
        event.preventDefault();
        setMenuShow(false);
        setFun('xoa');
    };

    const openNewTab = (event) => {
        event.preventDefault();
        window.open(window.location.href + '/' + link);
        setMenuShow(false);
    };

    const showContenMenu = (event) => {
        event.preventDefault();
        console.log('showContenMenu');
        var pos = cardRef.current?.getBoundingClientRect();
        var x = event.clientX - pos.x - 150 / 2;
        var y = event.clientY - pos.y;

        if (event.clientX + 150 / 2 >= window.innerWidth) {
            x = window.innerWidth - pos.x - 150;
        }

        if (event.clientX - 150 / 2 < 0) {
            x = -pos.x;
        }

        setPos([x, y]);
        setMenuShow(true);
    };

    return (
        <div className="card" onContextMenu={showContenMenu} ref={cardRef}>
            <Link to={'edit/' + (link ? link : 'new')}>
                <div className="thumbnail ">
                    {children ? (
                        children
                    ) : thumbnail ? (
                        <img src={thumbnail} alt={name} />
                    ) : (
                        <box-icon name="image"></box-icon>
                    )}
                </div>
                <div className="des">
                    <div className="left">
                        <p className="name">{name}</p>
                        <p className="auther">{des}</p>
                    </div>
                    <div className="right">
                        {link ? (
                            <>
                                <div className="mose" onClick={showContenMenu}>
                                    <box-icon name="dots-vertical-rounded"></box-icon>
                                </div>

                                <div
                                    className="popup"
                                    ref={contextMenuRef}
                                    style={{ display: isMenuShow ? 'block' : 'none', top: pos[1], left: pos[0] }}
                                >
                                    <div className="context-menu">
                                        <div className="line" onClick={changeName}>
                                            <box-icon name="rename"></box-icon>
                                            <span>Đổi tên</span>
                                            <Popup
                                                open={fun === 'rename'}
                                                closeOnDocumentClick
                                                closeOnEscape
                                                onClose={closeModal}
                                            >
                                                <PopupChangName
                                                    initName={name}
                                                    onCancel={() => setFun('')}
                                                    onOk={(name) => console.log('chang name to', name)}
                                                />
                                            </Popup>
                                        </div>
                                        <div className="line" onClick={deleteTkb}>
                                            <box-icon name="trash-alt"></box-icon>
                                            <span>Xoá</span>

                                            <Popup
                                                open={fun === 'xoa'}
                                                closeOnDocumentClick
                                                closeOnEscape
                                                onClose={closeModal}
                                            >
                                                <div className="conten-menu-popup">
                                                    <div className="header">
                                                        <h2>Xoá thời khoá biểu?</h2>
                                                    </div>
                                                    <div className="content">
                                                        <p>
                                                            "{name}" sẽ bị xoá vĩnh viễn bạn có chắc là muốn xoá không
                                                        </p>
                                                    </div>
                                                    <div className="buttons">
                                                        <button className="cancel" onClick={() => setFun('')}>
                                                            Huỷ
                                                        </button>
                                                        <button className="ok" onClick={() => console.log('xoá')}>
                                                            xoá
                                                        </button>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </div>
                                        <div className="line" onClick={openNewTab}>
                                            <box-icon name="link-external"></box-icon>
                                            <span>Mở ở tab mới</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default Card;
