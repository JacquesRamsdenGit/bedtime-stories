
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './router';

import en from './locales/en.json';
import af from './locales/af.json';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, af },
});

const pinia = createPinia();
const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .mount('#app');
