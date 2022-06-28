import i18n from "i18next";
import {I18nextProvider} from 'react-i18next';
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import './index.css';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import '@nosferatu500/react-sortable-tree/style.css';
import {useTranslation, initReactI18next} from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import store from "./store";
import {Provider} from "react-redux";

window.$apikey = "477f46c6-4a17-4163-83cc-29908d";

const callLang = () => i18n.on("load");

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi)
    .init({
        // debug:true,
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        fallbackLng: "en", detection: {
            order: ['path', 'htmlTag'],
            caches: [],
        }, backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
        // , react: {useSuspense: false}
        
    });

export default i18n;

const loadingMarkup = (
    <div className="py-4 text-center">
        <h1>Loading ...</h1>
    </div>
);

ReactDOM.render(<Suspense fallback={loadingMarkup}>
    <React.StrictMode>
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <App/>
            </Provider>
        </I18nextProvider>
    </React.StrictMode>
</Suspense>, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
