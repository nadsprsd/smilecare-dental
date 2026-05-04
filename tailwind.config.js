/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dental: {
          light: "#F8FAFC",
          teal:  "#00C9B1",
          dark:  "#0A2540",
        },
        primary: {
          500: "#00A3E0",
          600: "#0087ba",
        },
      },
    },
  },
  plugins: [],
};