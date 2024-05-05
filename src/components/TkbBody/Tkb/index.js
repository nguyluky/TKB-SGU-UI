import React from 'react';
import './Tkb.scss';

function Tkb({ row, column }) {
    return (
        <div className="tkb" style={{ gridTemplateRows: `55px repeat(${row}, 1fr)` }}>
            <div className="tkb-row head" style={{ gridTemplateColumns: `55px repeat(${column}, 1fr)` }}>
                <div className="tkb-colmun head"></div>
                {Array.from(Array(column).keys()).map((e) => {
                    return (
                        <div className="tkb-colmun" key={e}>
                            {e + 2}
                        </div>
                    );
                })}
            </div>
            {Array.from(Array(row).keys()).map((index) => {
                return (
                    <div className="tkb-row" key={index} style={{ gridTemplateColumns: `55px repeat(${column}, 1fr)` }}>
                        <div className="tkb-colmun head">Tiết {index + 1}</div>
                        {Array.from(Array(column).keys()).map((e) => {
                            return <div className="tkb-colmun" key={e}></div>;
                        })}
                    </div>
                );
            })}
        </div>
    );
}

export default Tkb;
