/* eslint-disable @typescript-eslint/no-unused-vars */
import classNames from 'classnames/bind';
import { useState } from 'react';
import style from './Test.module.scss';

const cx = classNames.bind(style);

function Test() {
    const [tab, setTab] = useState<number>(0);

    return <p>test</p>;
}

export default Test;
