/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fredoka: ["Fredoka", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        "comic-neue": ["Comic Neue", "cursive"],
      },
      colors: {
        primary: "#7c3aed", // purple-600
        secondary: "#3b82f6", // blue-500
        background: "#f5f3ff", // purple-50
        foreground: "#1e293b", // slate-800
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
