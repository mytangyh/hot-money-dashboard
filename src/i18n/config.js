import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        loading: 'Loading...',
        error: 'Error loading data'
      }
    },
    zh: {
      translation: {
        loading: '加载中...',
        error: '数据加载失败'
      }
    }
  },
  lng: 'zh',
  fallbackLng: 'en'
});