/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-primary)', 'ui-sans-serif', 'system-ui'],
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
      fontSize: {
        h1: [
          'var(--text-h1)',
          {
            lineHeight: 'var(--leading-heading)',
            fontWeight: 'var(--fw-bold)',
          },
        ],
        h2: [
          'var(--text-h2)',
          {
            lineHeight: 'var(--leading-heading)',
            fontWeight: 'var(--fw-bold)',
          },
        ],
        h3: [
          'var(--text-h3)',
          {
            lineHeight: 'var(--leading-heading)',
            fontWeight: 'var(--fw-bold)',
          },
        ],
        h4: [
          'var(--text-h4)',
          { lineHeight: '120%', fontWeight: 'var(--fw-bold)' },
        ],
        h5: [
          'var(--text-h5)',
          { lineHeight: '120%', fontWeight: 'var(--fw-bold)' },
        ],
        h6: [
          'var(--text-h6)',
          { lineHeight: '120%', fontWeight: 'var(--fw-bold)' },
        ],

        xl: [
          'var(--text-xl)',
          {
            lineHeight: 'var(--leading-body)',
            letterSpacing: 'var(--tracking-normal)',
          },
        ],
        md: [
          'var(--text-md)',
          {
            lineHeight: 'var(--leading-body)',
            letterSpacing: 'var(--tracking-normal)',
          },
        ],
        sm: [
          'var(--text-sm)',
          {
            lineHeight: 'var(--leading-body)',
            letterSpacing: 'var(--tracking-normal)',
          },
        ],
      },
      fontWeight: {
        bold: 'var(--fw-bold)',
        semibold: 'var(--fw-semibold)',
        medium: 'var(--fw-medium)',
        regular: 'var(--fw-regular)',
      },
      letterSpacing: {
        normal: 'var(--tracking-normal)',
      },
    },
  },
  plugins: [],
};
