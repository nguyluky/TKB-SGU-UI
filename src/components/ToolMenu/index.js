import React, { useEffect, useRef, useState } from 'react';
import './ToolMenu.scss';

function ToolWarp({ data }) {
    return data ? (
        <div className="tool_warp">
            {data.map((e, i) => {
                return <Tool data={e} key={i} />;
            })}
        </div>
    ) : (
        ''
    );
}

function Tool({ data, pos }) {
    var listTool = data.data;
    var onclickHandle = data.onclick;

    const [isShow, setShow] = useState(false);

    return (
        <div className="tool" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <p onClick={onclickHandle}>{data.displayName}</p>

            {isShow ? (
                <div className={pos ? 'popup-wall ' + pos : 'popup-wall left'}>
                    <ToolWarp data={listTool} />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

function ToolLeve1({ setShow, element, index, show, currIndex, setIndex }) {
    const ref = useRef(null);

    useEffect(() => {
        function onClickOut(event) {
            if (currIndex === index && ref.current && !ref.current.contains(event.target)) {
                setIndex(-1);
                setShow(false);
            }
        }

        document.addEventListener('mousedown', onClickOut);

        return () => {
            document.removeEventListener('mousedown', onClickOut);
        };
    }, [ref, currIndex, index, setShow, setIndex]);

    return (
        <div className="tool" ref={ref}>
            <p onClick={() => setShow(true)} onMouseEnter={() => setIndex(index)}>
                {element.displayName}
            </p>

            {show && currIndex === index ? (
                <div className="popup-wall bottom">
                    <ToolWarp data={element.data} />
                </div>
            ) : (
                ''
            )}
        </div>
    );
}

function ToolMenu({ children }) {
    const [show, setShow] = useState(false);
    const [currIndex, setIndex] = useState(-1);

    const childrens = children.map((element, index) => {
        return (
            <ToolLeve1
                key={index}
                element={element}
                currIndex={currIndex}
                index={index}
                setShow={setShow}
                show={show}
                setIndex={setIndex}
            />
        );
    });

    return <div className="tools_menu">{childrens}</div>;
}

export default ToolMenu;
