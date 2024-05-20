import React from 'react';
import './Loading.scss';

function Loading({ cellSize }) {
    return (
        <div className="loader-wall">
            <div className="loader" style={cellSize ? { '--cell-size': cellSize } : {}}>
                <div className="cell d-0" />
                <div className="cell d-1" />
                <div className="cell d-2" />
                <div className="cell d-1" />
                <div className="cell d-2" />
                <div className="cell d-2" />
                <div className="cell d-3" />
                <div className="cell d-3" />
                <div className="cell d-4" />
            </div>
        </div>
    );
}

export default Loading;
