// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'day',
      htmlAttrs: { lang: 'zh-CN'},
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        {
          name: 'description',
          content: 'Schedule working days online'
        },
        { charset: "utf-8" }
      ],
    }
  },
  ssr: false,
  modules: [ '@unocss/nuxt', ],
})
