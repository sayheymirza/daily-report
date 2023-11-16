/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar')],
  daisyui: {
    rtl: true,
    themes: ["retro"]
  }
};
