import './GlobalStyles.scss';

function setDarkMode() {
    const css = {
        '--background-color-1': '#1b1b1b',
        '--background-color-2': '#282a2c',
        '--text-color': '#e3e3e3',
        '--text-color-2': '#898989',
        '--hover-color': 'rgba(232,234,237,.08)',
        '--color-hover': '#e3e3e3',
        '--height-line-color': 'rgba(255,255,255,0.2)',
    };
    Object.keys(css).forEach((key) => {
        document.documentElement.style.setProperty(key, css[key]);
    });
}

function setLightMode() {
    const css = {
        '--background-color-1': '#e9eef6',
        '--background-color-2': 'whitesmoke',
        '--text-color': '#3c4043',
        '--text-color-2': '#5b5f63',
        '--hover-color': 'rgba(0, 0, 0, 0.05)',
        '--color-hover': 'rgb(75, 79, 82)',
        '--height-line-color': 'rgb(218, 220, 224)',
    };

    Object.keys(css).forEach((key) => {
        document.documentElement.style.setProperty(key, css[key]);
    });
}

function GlobalStyles({ children }) {
    return children;
}

export { setDarkMode, setLightMode };

export default GlobalStyles;
