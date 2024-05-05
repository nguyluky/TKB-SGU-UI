import React from 'react'; // nạp thư viện react
import ReactDOM from 'react-dom'; // nạp thư viện react-dom
import { createRoot } from 'react-dom/client';

import GlobalStyles from '~/components/GlobalStyles';
import App from '~/App';

const root = createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <GlobalStyles>
            <App />
        </GlobalStyles>
    </React.StrictMode>,
);
