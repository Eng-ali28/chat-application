/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "./*.html"],
  theme: {
    extend: {
      height: {
        "screen-mix": "calc(100vh - 92px)",
      },
    },
  },
  plugins: [],
};
