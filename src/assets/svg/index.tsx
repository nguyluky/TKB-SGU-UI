import { SVGAttributes } from 'react';

interface IconSvgProps extends SVGAttributes<SVGSVGElement> {}

function Cloudy(props: IconSvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            width={1440}
            height={560}
            preserveAspectRatio="none"
            viewBox="0 0 1440 560"
            {...props}
        >
            <g mask='url("#SvgjsMask1144")' fill="none">
                <rect width={1440} height={560} x={0} y={0} fill="#1e3266" />
                <path
                    d="M1512 560L0 560 L0 340.03Q85.31 305.33, 120 390.64Q161.34 311.98, 240 353.32Q260.31 301.63, 312 321.95Q358.22 296.17, 384 342.4Q469.4 307.8, 504 393.21Q533.19 350.4, 576 379.59Q590.31 321.9, 648 336.22Q715.79 284.01, 768 351.81Q828.6 340.41, 840 401.02Q845.28 334.3, 912 339.58Q981.92 289.5, 1032 359.42Q1101.86 309.28, 1152 379.14Q1188.9 296.04, 1272 332.95Q1345.86 286.81, 1392 360.66Q1464.19 312.85, 1512 385.04z"
                    fill="#182f5d"
                />
                <path
                    d="M1464 560L0 560 L0 438.09Q26.57 392.66, 72 419.23Q113.78 341.01, 192 382.79Q240.66 359.45, 264 408.11Q347.19 371.31, 384 454.5Q434.84 385.34, 504 436.17Q523.33 383.5, 576 402.83Q663.86 370.69, 696 458.55Q742.56 385.12, 816 431.68Q868.05 363.73, 936 415.78Q986.29 394.07, 1008 444.36Q1075.03 391.39, 1128 458.43Q1135.94 394.38, 1200 402.32Q1241.19 371.51, 1272 412.7Q1316.75 337.44, 1392 382.19Q1436.45 354.64, 1464 399.09z"
                    fill="#25467d"
                />
                <path
                    d="M1464 560L0 560 L0 454.31Q35.06 417.38, 72 452.44Q154.41 414.85, 192 497.26Q235.65 420.91, 312 464.57Q364.49 397.06, 432 449.54Q490.45 435.99, 504 494.44Q553.92 472.36, 576 522.28Q603.27 477.55, 648 504.82Q655.87 440.69, 720 448.56Q786.54 395.11, 840 461.65Q920.01 421.66, 960 501.68Q1013.41 435.09, 1080 488.5Q1107.84 444.34, 1152 472.18Q1196.56 396.74, 1272 441.3Q1370.99 420.29, 1392 519.28Q1396.04 451.31, 1464 455.35z"
                    fill="#356cb1"
                />
                <path
                    d="M1464 560L0 560 L0 554.38Q24.02 506.4, 72 530.43Q97 483.43, 144 508.44Q232.73 477.17, 264 565.9Q292.75 522.65, 336 551.41Q347.79 491.2, 408 503Q484.61 459.61, 528 536.22Q607.5 495.73, 648 575.23Q656.64 511.88, 720 520.52Q791.21 471.73, 840 542.94Q881.87 464.81, 960 506.68Q1027.2 453.88, 1080 521.09Q1150.19 471.28, 1200 541.47Q1271.91 493.38, 1320 565.29Q1363.97 537.26, 1392 581.23Q1405.6 522.83, 1464 536.42z"
                    fill="white"
                />
            </g>
            <defs>
                <mask id="SvgjsMask1144">
                    <rect width={1440} height={560} fill="#ffffff" />
                </mask>
            </defs>
        </svg>
    );
}

function Cloud(props: IconSvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-cloud"
            {...props}
        >
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
    );
}

function CloudOff(props: IconSvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-cloud-off"
            {...props}
        >
            <path d="m2 2 20 20" />
            <path d="M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" />
            <path d="M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" />
        </svg>
    );
}

function CloudUpload(props: IconSvgProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-cloud-upload"
            {...props}
        >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m16 16-4-4-4 4" />
        </svg>
    );
}

const svgs = { Cloud, Cloudy, CloudOff, CloudUpload };

export default svgs;
