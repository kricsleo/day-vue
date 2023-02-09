// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'day',
      "meta": [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        },
        { charset: "utf-8" }
      ],
    }
  },
  ssr: false,
  modules: [ '@unocss/nuxt', ],
})
