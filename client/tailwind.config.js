export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      height: {
        header: '60px',
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        light: 'var(--color-light)',
        dark: 'var(--color-dark)',
        white: 'var(--color-white)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
    },
  },
  plugins: [],
}
