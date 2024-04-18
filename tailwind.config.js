/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/qaftoplaygroundnew/dist/*.{js, jsx, json, html,map,css}",
    "./dist/*.{js, jsx, json, html}",
    "./src/**/*.{js,jsx,json}",
  ],
  theme: {
    extend: {
      colors: {
        primary_color: "#091242",
        secondary_color: "#FFB629",
        bg_color: "#FFF",
        textColor: "#091242",
      },
      fontFamily: { primary_font_family: ["Rubik", "Krub", "sans-serif"] },
      fontSize: {
        primary_font_size: "32px",
        secondary_font_size: "14px",
        font_size: "16px",
      },
      lineHeight: {},
    },
    containers: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },

  plugins: [require("@tailwindcss/container-queries")],
};
