import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import language resources
import en from './locales/en.json'
import vi from './locales/vi.json'

const resources = {
  en: {
    translation: en
  },
  vi: {
    translation: vi
  }
}

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],

      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // Cache user language on
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'], // Languages to not persist (cookie, localStorage)

      // Optional expire and domain for set cookie
      cookieMinutes: 10,
      cookieDomain: 'myDomain',

      // Optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement,

      // Optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
      cookieOptions: { path: '/', sameSite: 'strict' }
    }
  })

export default i18n 