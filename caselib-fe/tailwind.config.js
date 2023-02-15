/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 关闭tailwindcss默认样式，手动处理冲突；
    //如果需要默认样式，请建立preflight.css文件重新定义默认样式
    preflight: false,
  }
}
