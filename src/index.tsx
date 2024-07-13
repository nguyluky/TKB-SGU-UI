import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { GlobalProvider } from './store/GlobalContent';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <StrictMode>
        <GlobalStyles>
            <GlobalProvider>
                <App />
            </GlobalProvider>
        </GlobalStyles>
    </StrictMode>,
);
