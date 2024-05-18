import React from 'react'; // nạp thư viện react
import ReactDOM from 'react-dom'; // nạp thư viện react-dom
import { createRoot } from 'react-dom/client';

import GlobalStyles from '~/components/GlobalStyles';
import App from '~/App';
import Provider from './store/Provider';

const root = createRoot(document.getElementById('root'));
root.render(
    <GlobalStyles>
        <Provider>
            <App />
        </Provider>
    </GlobalStyles>,
);
