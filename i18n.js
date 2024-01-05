import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

const resources = {
  en: {
    translation: {
      'Sorry, your device must have screen lock enabled.': 'Sorry, your device must have screen lock enabled.AAA',
    },
  },
  fr: {
    translation: {
      'Welcome to React': 'Bienvenue à React et react-i18next',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
