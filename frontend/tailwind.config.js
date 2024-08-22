/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'brown-gradient': 'radial-gradient(circle, #D2691E, #D2691E, #D2691E)',
         'wood-gradient': 'linear-gradient(135deg, #A0522D 0%, #C19A6B 25%, #D2B48C 50%, #C19A6B 75%,#A0522D 100%)',
      },
    },
  },
  plugins: [],
};
