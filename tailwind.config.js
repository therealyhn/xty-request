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
        border: {
          light: 'rgba(255,255,255,0.05)',
          base: 'rgba(255,255,255,0.10)',
          strong: 'rgba(255,255,255,0.20)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        h1: ['64px', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        h2: ['40px', { lineHeight: '1.0', letterSpacing: '-0.01em' }],
        h3: ['28px', { lineHeight: '1.1' }],
        body: ['16px', { lineHeight: '1.6' }],
        label: ['12px', { lineHeight: '1.2', letterSpacing: '0.28em' }],
      },
      borderRadius: {
        surface: '16px',
        chip: '999px',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0,0,0,0.35)',
        glow: '0 0 30px rgba(255,255,255,0.12)',
      },
      backgroundImage: {
        'text-glow': 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))',
      },
      keyframes: {
        equalizer: {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        equalizer: 'equalizer 1.2s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
        scan: 'scan 1.8s linear infinite',
        fadeUp: 'fadeUp 0.6s ease-out both',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          md: '2rem',
          lg: '2.5rem',
        },
      },
    },
  },
  plugins: [],
}
