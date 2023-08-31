/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  // content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      blue: "#54A0CF",
      "blue-light": "#CAE1EE",
      "blue-grey": "#536F8E",
      yellow: "#E3D03D",
      green: "#92C83C",
      "green-light": "#ADD56C",
    },
    extend: {},
  },
  plugins: [],

  corePlugins: {
    // preflight: false,
  },
};
