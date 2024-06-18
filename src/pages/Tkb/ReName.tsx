import { useState } from 'react';
import Popup from 'reactjs-popup';
import PopupModel from '../../components/PopupModel';
import { cx } from './Tkb';

export function ReName({ defaultName, onChangeName }: { defaultName: string; onChangeName?: (s: string) => void }) {
    const [name, setName] = useState(defaultName);
    const [lastName, setLastName] = useState(defaultName);
    const [show, setShow] = useState(false);

    const renameHandle = () => {
        setLastName(name);
        if (onChangeName) onChangeName(name);
        setShow(false);
    };

    return (
        <div className={cx('rename-header')}>
            <p
                onClick={() => {
                    setShow(true);
                }}
            >
                {lastName}
            </p>

            <Popup open={show}>
                <PopupModel
                    title="Rename Tkb"
                    onCancel={() => {
                        setName(lastName);
                        setShow(false);
                    }}
                    onOk={renameHandle}
                >
                    <div className={cx('input')}>
                        <label form="inputname">New Name: </label>
                        <input
                            type="text"
                            name="inputname"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                </PopupModel>
            </Popup>
        </div>
    );
}
