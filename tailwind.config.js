/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        primary: 'var(--primaryText)',
        secondary: 'var(--secondaryText)',
        outline: 'var(--outlineStroke)',
      },
      fontFamily: {
        geist: ['GeistSans', 'sans-serif'],
        plex: ['IbmPlexMono', 'monospace'],
      },
    },
  },
  plugins: [],
};
