module.exports = {
  content: [
    "./**/*.{html,njk,js,md}",
  ],
  theme: {
    extend: {
      colors: {
        turquoise: '#1EC2C8',
        sunset: '#FF9B6A',
      },
      fontFamily: {
        'sans': ['Noto Sans JP', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
