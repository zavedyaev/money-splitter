import i18n from 'i18next'
import LanguageDetector from "i18next-browser-languagedetector"
import {initReactI18next} from 'react-i18next'
import languageEN from './locate/en/translate.json'
import languageRU from './locate/ru/translate.json'

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: languageEN,
            ru: languageRU
        },
        /* When react i18next not finding any language to as default in browser */
        // fallbackLng: "en",
        fallbackLng: {
            'en': ['en-GB', 'en-US'],
            'default': ['en']
        },
        /* debugger For Development environment */
        debug: true,
        ns: ["translations"],
        defaultNS: "translations",
        keySeparator: ".",
        // keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ","
        },
        react: {
            wait: true,
            bindI18n: 'languageChanged loaded',
            bindStore: 'added removed',
            nsMode: 'default'
        }
    })

export default i18n;