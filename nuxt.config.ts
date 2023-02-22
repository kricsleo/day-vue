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
  components: false,
  pages: false,
  imports: { autoImport: false },
  modules: [ '@unocss/nuxt', ],

  // @see https://github.com/unocss/unocss/blob/a2f44f84eec2b8da52dbd1bf199754334f638c49/packages/nuxt/src/types.ts#L10
  unocss: {
    autoImport: false,
    preflight: true,
    attributify: true,
    icons: true,
    shortcuts: [
      [/^wh-(.*)$/, ([, size]) => `w-${size} h-${size}`],
      ['center', 'flex justify-center items-center'],
      ['x-center', 'flex justify-center'],
      ['x-between', 'flex justify-between'],
      ['y-center', 'flex items-center'],
      ['transition', 'duration-150 transition-all'],
      [/^expand-click-?(.*)$/, ([,size]) => `cursor-pointer relative before:content-[""] before:absolute before:inset--${size || 3}`],
    ],
  },

})
