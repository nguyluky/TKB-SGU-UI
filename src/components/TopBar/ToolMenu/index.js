import Tippy, { useSingleton } from '@tippyjs/react';
import React from 'react';
import './ToolMenu.scss';

function ToolWarp({ data }) {
    return (
        <div className="tool_warp">
            {data.map((e, i) => {
                return <Tool data={e} key={i} />;
            })}
        </div>
    );
}

function Tool({ data }) {
    var listTool = data.data;
    var onclickHandle = data.onclick;
    return listTool ? (
        <Tippy content={<ToolWarp data={listTool} />} trigger="click" interactive={true} placement="right-start">
            <div className="tool">
                <p>{data.displayName}</p>
            </div>
        </Tippy>
    ) : (
        <div className="tool" onClick={onclickHandle}>
            <p>{data.displayName}</p>
        </div>
    );
}

function ToolMenu({ children }) {
    const [isMenuShow, setMenuShow] = React.useState(false);

    const [source, target] = useSingleton();

    console.log(isMenuShow);

    const showMenu = () => {
        console.log('onclick');
        setMenuShow(true);
    };

    return (
        <div className="tools_menu">
            <Tippy
                singleton={source}
                interactive={true}
                placement="bottom-start"
                onClickOutside={() => console.log('ok')}
            />
            {children.map((element, index) => {
                return (
                    <Tippy singleton={target} content={<ToolWarp data={element.data} />} key={index}>
                        <div className="tool">
                            <p style={{ fontWeight: '500' }}>{element.displayName}</p>
                        </div>
                    </Tippy>
                );
            })}
        </div>
    );
}

export default ToolMenu;
