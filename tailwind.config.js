/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        xs: "500px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
        "-2xl": { max: "1535px" },
        "-xl": { max: "1279px" },
        "-lg": { max: "1023px" },
        "-md": { max: "767px" },
        "-sm": { max: "639px" },
        "-xs": { max: "499px" },
      },
    },
  },
  plugins: [require("daisyui"), require('tailwind-scrollbar')],
  daisyui: {
    rtl: true,
    themes: ["retro"]
  }
};
