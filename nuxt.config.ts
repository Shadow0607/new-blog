// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    public: {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN
    }
  },
  plugins: ['~/plugins/auth.js','~/plugins/captchaGenerator.js']
})