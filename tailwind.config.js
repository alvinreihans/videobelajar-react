/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          400: 'var(--primary-400)',
          300: 'var(--primary-300)',
          200: 'var(--primary-200)',
          100: 'var(--primary-100)',
        },

        secondary: {
          DEFAULT: 'var(--secondary)',
          400: 'var(--secondary-400)',
          300: 'var(--secondary-300)',
          200: 'var(--secondary-200)',
          100: 'var(--secondary-100)',
        },

        tertiary: {
          DEFAULT: 'var(--tertiary)',
          400: 'var(--tertiary-400)',
          300: 'var(--tertiary-300)',
          200: 'var(--tertiary-200)',
          100: 'var(--tertiary-100)',
        },

        info: {
          DEFAULT: 'var(--info-default)',
          hover: 'var(--info-hover)',
          pressed: 'var(--info-pressed)',
          bg: 'var(--info-bg)',
        },

        success: {
          DEFAULT: 'var(--success-default)',
          hover: 'var(--success-hover)',
          pressed: 'var(--success-pressed)',
          bg: 'var(--success-bg)',
        },

        warning: {
          DEFAULT: 'var(--warning-default)',
          hover: 'var(--warning-hover)',
          pressed: 'var(--warning-pressed)',
          bg: 'var(--warning-bg)',
        },

        error: {
          DEFAULT: 'var(--error-default)',
          hover: 'var(--error-hover)',
          pressed: 'var(--error-pressed)',
          bg: 'var(--error-bg)',
        },

        grey: {
          900: 'var(--grey-900)',
          800: 'var(--grey-800)',
          700: 'var(--grey-700)',
          600: 'var(--grey-600)',
          500: 'var(--grey-500)',
          400: 'var(--grey-400)',
          300: 'var(--grey-300)',
          200: 'var(--grey-200)',
          100: 'var(--grey-100)',
          50: 'var(--grey-50)',
        },

        background: {
          primary: 'var(--bg-primary)',
          base: 'var(--bg-base)',
          secondary: 'var(--bg-secondary)',
        },

        text: {
          dark: {
            primary: 'var(--text-dark-primary)',
            secondary: 'var(--text-dark-secondary)',
            disabled: 'var(--text-dark-disabled)',
          },

          light: {
            primary: 'var(--text-light-primary)',
            secondary: 'var(--text-light-secondary)',
            disabled: 'var(--text-light-disabled)',
          },
        },

        border: {
          DEFAULT: 'var(--border-default)',
        },

        gradients: {
          'gradient-info': 'var(--gradient-info)',
          'gradient-success': 'var(--gradient-success)',
          'gradient-warning': 'var(--gradient-warning)',
          'gradient-error': 'var(--gradient-error)',
        },
      },
    },
  },
  plugins: [],
};
