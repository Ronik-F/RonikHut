/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: '#FAF6F0',
          100: '#F5EFEB',
          200: '#EBE1D5',
          300: '#DACAB5',
          400: '#C4AB8E',
          500: '#A98B68',
          600: '#8C6C47',
          700: '#6F4E37', // Coffee brown
          800: '#4D3322', // Dark roast
          900: '#2C1D11', // Espresso
          950: '#1A1009', // Deep onyx espresso
        },
        cream: {
          50: '#FFFEFA',
          100: '#FDFBF7',
          200: '#FAF5EC',
          300: '#F3ECE0',
          400: '#E7DCCB',
        },
        caramel: {
          light: '#E6B17E',
          DEFAULT: '#C88A58',
          dark: '#A66B3B',
        },
        sage: {
          50: '#F3F6F4',
          100: '#E2EBE4',
          500: '#4A6B53',
          700: '#2E4434',
        },
        terracotta: {
          light: '#D97768',
          DEFAULT: '#B85042',
          dark: '#8C382C',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 8px -1px rgba(44, 29, 17, 0.06), 0 1px 3px -1px rgba(44, 29, 17, 0.04)',
        'warm-md': '0 8px 24px -4px rgba(44, 29, 17, 0.08), 0 2px 6px -2px rgba(44, 29, 17, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(44, 29, 17, 0.12), 0 4px 12px -2px rgba(44, 29, 17, 0.06)',
        'warm-xl': '0 24px 50px -12px rgba(44, 29, 17, 0.18)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};
