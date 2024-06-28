// plugins/auth.js
import authService from '~/services/authService';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('auth', authService)
});
