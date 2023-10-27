/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#364CC1',
        'light-blue':'#14226D',
        'dashboard-green':'#17A88F',
        'sea-green':'#5ECCB9',      
    },
  },
  plugins: [],
}

}