/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          "primary": "#eab308",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          "primary": "#eab308",
        },
      }
    ],
  }
};

module.exports = config;
