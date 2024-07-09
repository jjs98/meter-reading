const { addDynamicIconSelectors } = require('@iconify/tailwind');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: [
    addDynamicIconSelectors({
      prefix: 'i',
      overrideOnly: true,
    }),
    plugin(function ({ addBase }) {
      addBase({
        html: { fontSize: '14px' },
      });
    }),
  ],
};
