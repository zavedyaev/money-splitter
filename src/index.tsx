import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import 'bootstrap';
import './scss/custom.scss';
import {I18nextProvider} from 'react-i18next';
import i18n from './i18n'

const container = document.getElementById('root')
const root = createRoot(container!);
root.render(
    <I18nextProvider i18n={i18n}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </I18nextProvider>
);

