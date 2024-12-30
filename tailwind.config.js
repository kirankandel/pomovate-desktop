/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all React files
    "./src-tauri/**/*.{html,js}", // Include Tauri's HTML files if necessary
    "./index.html",              // Main HTML file
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

