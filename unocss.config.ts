import { defineConfig, presetIcons, presetUno, presetAttributify } from 'unocss'

/** @see https://github.com/unocss/unocss */
export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({ scale: 1.2, warn: true, }),
  ],
  shortcuts: [
    [/^wh-(.*)$/, ([, size]) => `w-${size} h-${size}`],
    ['center', 'flex justify-center items-center'],
    ['x-center', 'flex justify-center'],
    ['x-between', 'flex justify-between'],
    ['y-center', 'flex items-center'],
  ],
})
