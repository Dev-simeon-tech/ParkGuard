module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#131b2e',
          primary: '#006a61',
          dark: '#0a0a0a',
          grey: '#76777D',
          teal: '#86F2E4',
          border: '#C6C6CD',
          surface: '#45464D',
        },
      },
      fontFamily: {
        'jetBrainsMono-Regular': ['JetBrainsMono-Regular'],
        'jetBrainsMono-Medium': ['JetBrainsMono-Medium'],
      },
    },
  },
  plugins: [],
};
