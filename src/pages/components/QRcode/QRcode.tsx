import { motion } from 'motion/react';
import qrcode from 'qrcode-generator';
import React, { useEffect, useRef, useState } from 'react';
import './QRcode.css';

export enum QRCodeEntity {
    Module = 'module',
    PositionRing = 'position-ring',
    PositionCenter = 'position-center',
    Icon = 'icon',
}

interface QRCodeProps {
    contents?: string;
    moduleColor?: string;
    positionRingColor?: string;
    positionCenterColor?: string;
    maskXToYRatio?: number;
    lever?: ErrorCorrectionLevel;
    squares?: boolean;
    onCodeRendered?: () => void;
}

export interface QrRef {
    // animateQRCode: (animation?: AnimationPreset | QRCodeAnimation) => void;
}

function QRPositionDetectionPattern({
    x,
    y,
    margin,
    ringFill,
    centerFill,
    coordinateShift,
}: {
    x: number;
    y: number;
    margin: number;
    ringFill: string;
    centerFill: string;
    coordinateShift: number;
}) {
    return (
        <>
            <motion.path
                className="position-ring"
                fill={ringFill}
                data-column={x - margin}
                data-row={y - margin}
                d={`M${x - coordinateShift} ${
                    y - 0.5 - coordinateShift
                }h6s.5 0 .5 .5v6s0 .5-.5 .5h-6s-.5 0-.5-.5v-6s0-.5 .5-.5zm.75 1s-.25 0-.25 .25v4.5s0 .25 .25 .25h4.5s.25 0 .25-.25v-4.5s0-.25 -.25 -.25h-4.5z`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.3,
                    delay: 1.2,
                }}
            />
            <motion.path
                className="position-center"
                fill={centerFill}
                data-column={x - margin + 2}
                data-row={y - margin + 2}
                d={`M${x + 2 - coordinateShift} ${
                    y + 1.5 - coordinateShift
                }h2s.5 0 .5 .5v2s0 .5-.5 .5h-2s-.5 0-.5-.5v-2s0-.5 .5-.5z`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.3,
                    delay: 1.2,
                }}
            />
        </>
    );
}

function QRPositionDetectionPatterns({
    count,
    margin,
    ringFill,
    centerFill,
    coordinateShift,
}: {
    count: number;
    margin: number;
    ringFill: string;
    centerFill: string;
    coordinateShift: number;
}) {
    return (
        <>
            <QRPositionDetectionPattern
                x={margin}
                y={margin}
                margin={margin}
                ringFill={ringFill}
                centerFill={centerFill}
                coordinateShift={coordinateShift}
            />
            <QRPositionDetectionPattern
                x={count - 7 + margin}
                y={margin}
                margin={margin}
                ringFill={ringFill}
                centerFill={centerFill}
                coordinateShift={coordinateShift}
            />
            <QRPositionDetectionPattern
                x={margin}
                y={count - 7 + margin}
                margin={margin}
                ringFill={ringFill}
                centerFill={centerFill}
                coordinateShift={coordinateShift}
            />
        </>
    );
}

function isPositioningElement(row: number, column: number, count: number) {
    const elemWidth = 7;
    return row <= elemWidth
        ? column <= elemWidth || column >= count - elemWidth
        : column <= elemWidth
        ? row >= count - elemWidth
        : false;
}

function QRModules({
    qr,
    margin,
    maskXToYRatio,
    moduleFill,
    coordinateShift,
}: {
    qr: QRCode;
    margin: number;
    maskXToYRatio: number;
    moduleFill: string;
    coordinateShift: number;
}) {
    const moduleCount = qr.getModuleCount();

    return (
        <>
            {[...Array(moduleCount)].map((_, row) => {
                const positionY = row + margin - coordinateShift - 0.5;
                return [...Array(moduleCount)].map((_, column) => {
                    if (qr.isDark(row, column) && !isPositioningElement(row, column, moduleCount)) {
                        const positionX = column + margin - coordinateShift - 0.5;

                        const d = Math.sqrt(positionX * positionX + positionY * positionY);
                        // console.log((d - 0.1) / Math.sqrt(coordinateShift * coordinateShift));
                        return (
                            <motion.rect
                                key={`${row}-${column}`}
                                className="module"
                                fill={moduleFill}
                                data-column={column}
                                data-row={row}
                                x={positionX}
                                y={positionY}
                                width={1}
                                height={1}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    duration: 0.1,
                                    delay: (d - 0.1) / (Math.sqrt(coordinateShift * coordinateShift) * 2),
                                }}
                            />
                        );
                    }
                    return null;
                });
            })}
        </>
    );
}

const QRCode = React.memo(
    React.forwardRef<QrRef, QRCodeProps>(
        (
            {
                contents = '',
                moduleColor = '#001',
                lever = 'H',
                positionRingColor = '#000',
                positionCenterColor = '#000',
                maskXToYRatio = 1,
                squares = false,
                onCodeRendered,
            },
            ref
        ) => {
            const qrCodeElement = useRef<HTMLDivElement>(null);
            const margin = 4;
            const [moduleCount, setModuleCount] = useState<number>(0);
            const [pixelSize, setPixelSize] = useState<number>(0);
            const [coordinateShift, setCoordinateShift] = useState<number>(0);

            const [qr, setQR] = useState<QRCode | null>(null);

            useEffect(() => {
                const qr = qrcode(0, lever);
                qr.addData(contents);
                qr.make();
                const moduleCount = qr.getModuleCount();
                const pixelSize = moduleCount + margin * 2;
                const coordinateShift = pixelSize / 2;
                setModuleCount(moduleCount);
                setPixelSize(pixelSize);
                setCoordinateShift(coordinateShift);
                setQR(qr);
            }, [contents, lever]);

            return (
                <div ref={qrCodeElement} id="qr-container">
                    <div id="icon-container" style={squares ? { display: 'none', visibility: 'hidden' } : {}}>
                        <div
                            id="icon-wrapper"
                            style={{ width: `${18 * maskXToYRatio}%` }}
                            data-column={moduleCount / 2}
                            data-row={moduleCount / 2}
                        >
                            <slot name="icon" />
                        </div>
                    </div>
                    <div>
                        <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width={'100%'}
                            height={'100%'}
                            viewBox={`${0 - coordinateShift} ${0 - coordinateShift} ${pixelSize} ${pixelSize}`}
                            preserveAspectRatio="xMinYMin meet"
                        >
                            <rect
                                width={'100%'}
                                height={'100%'}
                                fill="white"
                                fillOpacity="0"
                                x={-coordinateShift}
                                y={-coordinateShift}
                            />

                            <QRPositionDetectionPatterns
                                count={moduleCount}
                                margin={4}
                                ringFill={positionRingColor}
                                centerFill={positionCenterColor}
                                coordinateShift={coordinateShift}
                            />

                            {qr && (
                                <QRModules
                                    qr={qr}
                                    margin={4}
                                    maskXToYRatio={maskXToYRatio}
                                    moduleFill={moduleColor}
                                    coordinateShift={coordinateShift}
                                />
                            )}
                        </svg>
                    </div>
                </div>
            );
        }
    )
);

export default QRCode;
