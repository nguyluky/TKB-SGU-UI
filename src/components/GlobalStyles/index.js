import './GlobalStyles.scss';

const themes = {
    light: {
        '--background-color-1': '#e9eef6',
        '--background-color-2': 'whitesmoke',
        '--text-color': '#3c4043',
        '--text-color-2': '#5b5f63',
        '--hover-color': 'rgba(0, 0, 0, 0.05)',
        '--color-hover': 'rgb(75, 79, 82)',
        '--height-line-color': 'rgb(218, 220, 224)',

        '--primary-color-1': '#33b5c4',
        '--primary-color-2': '#1a73e8',
        '--primary-color-3': '#0d2b53',

        '--button-color-1': '#1a73e8',
    },
    dracula: {
        '--background-color-1': 'rgb(40 42 54)',
        '--background-color-2': 'rgb(52 55 70)',
        '--text-color': '#e3e3e3',
        '--text-color-2': '#898989',
        '--hover-color': 'rgba(232,234,237,.08)',
        '--color-hover': '#e3e3e3',
        '--height-line-color': 'rgba(255,255,255,0.2)',

        '--primary-color-1': '#0e1c26',
        '--primary-color-2': '#2a454b',
        '--primary-color-3': '#5f717f',

        '--button-color-1': 'rgb(161 121 192)',
    },
    dark: {
        '--background-color-1': '#1b1b1b',
        '--background-color-2': '#282a2c',
        '--text-color': '#e3e3e3',
        '--text-color-2': '#898989',
        '--hover-color': 'rgba(232,234,237,.08)',
        '--color-hover': '#e3e3e3',
        '--height-line-color': 'rgba(255,255,255,0.2)',

        '--primary-color-1': '#33b5c4',
        '--primary-color-2': '#1a73e8',
        '--primary-color-3': '#0d2b53',

        '--button-color-1': '#1a73e8',
    },
};

function setTheme(name) {
    const css = themes[name];

    if (!css) return;
    Object.keys(css).forEach((key) => {
        document.documentElement.style.setProperty(key, css[key]);
    });
}

function GlobalStyles({ children }) {
    return children;
}

export { themes, setTheme };

export default GlobalStyles;
