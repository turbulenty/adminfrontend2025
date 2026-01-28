import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';  //debug 0128
import zh from './locales/zh/translation.json';
import ja from './locales/ja/translation.json';
import en from './locales/en/translation.json';

const resources = {
  zh: { translation: zh },
  ja: { translation: ja },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'zh', // 默认中文
    fallbackLng: 'zh',
    debug: true,  //调试：看console里的i18n日志
    // detection: {  // ← 添加这个配置
    //   order: ['localStorage', 'navigator'],
    //   caches: ['localStorage']
    // },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
