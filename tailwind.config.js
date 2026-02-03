/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Deep zinc/black
        surface: '#18181b',    // Slightly lighter for cards/sections
        primary: '#fafafa',    // Main text
        secondary: '#a1a1aa',  // Muted text
        accent: '#52525b',     // Subtle gray/metallic accent
        'accent-blue': '#475569', // Muted slate blue
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
}