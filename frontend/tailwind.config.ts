import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sans: ['Robotto', 'sans-serif'],
      },
      fontSize:{
        customSearch: '1.35rem'
      },
      padding: {
        customPad: '.35em .35em 0'
      }
    },
  },
  plugins: [],
} satisfies Config;
