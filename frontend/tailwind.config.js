/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-container": "#817d6d",
        "on-secondary": "#1b247f",
        "error-container": "#93000a",
        "secondary-fixed-dim": "#bdc2ff",
        "on-primary": "#333124",
        "on-surface": "#e1e2e7",
        "tertiary": "#d8bbf4",
        "on-tertiary-fixed": "#26103e",
        "on-secondary-container": "#a8afff",
        "on-error-container": "#ffdad6",
        "background": "#111417",
        "error": "#ffb4ab",
        "surface": "#111417",
        "inverse-primary": "#625f4f",
        "surface-dim": "#111417",
        "outline": "#919097",
        "on-tertiary-fixed-variant": "#533d6c",
        "outline-variant": "#46464d",
        "on-secondary-fixed-variant": "#343d96",
        "primary-fixed-dim": "#ccc6b4",
        "secondary-container": "#343d96",
        "secondary-fixed": "#e0e0ff",
        "surface-container-highest": "#323539",
        "on-error": "#690005",
        "tertiary-fixed": "#efdbff",
        "on-tertiary-container": "#8c73a6",
        "on-tertiary": "#3c2654",
        "on-secondary-fixed": "#000767",
        "on-primary-fixed": "#1e1c10",
        "surface-bright": "#37393d",
        "on-background": "#e1e2e7",
        "primary-container": "#131207",
        "tertiary-fixed-dim": "#d8bbf4",
        "on-surface-variant": "#c7c5ce",
        "on-primary-fixed-variant": "#4a4739",
        "surface-container-low": "#191c1f",
        "surface-container-lowest": "#0c0e12",
        "surface-container-high": "#282a2e",
        "inverse-surface": "#e1e2e7",
        "primary": "#ccc6b4",
        "surface-container": "#1d2023",
        "surface-tint": "#ccc6b4",
        "inverse-on-surface": "#2e3134",
        "tertiary-container": "#1c0534",
        "surface-variant": "#323539",
        "secondary": "#bdc2ff",
        "primary-fixed": "#e8e2cf"
      },
      fontFamily: {
        "headline": ["Manrope", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "label": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      boxShadow: {
        "star-glow": "0 0 20px 2px rgba(204, 198, 180, 0.4)"
      },
      backgroundImage: {
        "nebula-bg": "radial-gradient(circle at 50% 50%, rgba(27, 36, 127, 0.15) 0%, transparent 70%)"
      }
    },
  },
  plugins: [],
}
