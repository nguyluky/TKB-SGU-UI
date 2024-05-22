import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export function Card({ name, des, dateCreated, link, thumbnail, children }) {
    const contextMenuRef = useRef(null);
    const cardRef = useRef(null);

    const [pos, setPos] = useState([0, 0]);

    const [isMenuShow, setMenuShow] = useState(false);

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
        console.log('change name');
        setMenuShow(false);
    };

    const deleteTkb = (event) => {
        event.preventDefault();
        console.log('deleteTkb');
        setMenuShow(false);
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
            <Link to={link ? link : 'new'}>
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
                                        </div>
                                        <div className="line" onClick={deleteTkb}>
                                            <box-icon name="trash-alt"></box-icon>
                                            <span>Xoá</span>
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
