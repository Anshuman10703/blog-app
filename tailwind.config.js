/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Remove './pages' if you only use 'app' directory for pages
    // './pages/**/*.{js,ts,jsx,tsx,mdx}', // <--- Consider removing or commenting out if no actual 'pages' directory

    './app/**/*.{js,ts,jsx,tsx,mdx}', // Covers everything inside the 'app' directory

    // CORRECTED: Change 'components' to 'Components' (capital C)
    './Components/**/*.{js,ts,jsx,tsx,mdx}', // <--- CORRECTED LINE

    // If you have any other top-level folders with Tailwind classes, add them here
    // For example, if you had a 'src' folder:
    // './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}