import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        '100': '28rem',
        '112': '32rem',
        '120': '36rem',
        '128': '40rem',
        '144': '48rem',
        '160': '56rem',
      },
      height: {
        '100': '28rem',
        '112': '32rem',
        '120': '36rem',
        '128': '40rem',
        '144': '48rem',
        '160': '56rem',
      },
      width: {
        '100': '28rem',
        '112': '32rem',
        '120': '36rem',
        '128': '40rem',
        '144': '48rem',
        '160': '56rem',
      },
    }
  }
} satisfies Config;
