/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#051C2C",
          deep: "#030F18",
          mid: "#0D3352",
          light: "#0A3A55",
        },
        teal: { DEFAULT: "#00AEC7" },
        sun: { DEFAULT: "#FCE300" },
      },
      fontFamily: {
        brand: ["'Mohr Rounded'", "'Nunito'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
