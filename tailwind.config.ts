import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      gridTemplateColumns: {
        '18': 'repeat(18, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))'
      },
      gridColumn: {
        'span-13': 'span 13 / span 20',
        'span-14': 'span 14 / span 18',
        'span-16': 'span 16 / span 20',
        'span-18': 'span 18 / span 20',
        'span-20': 'span 20 / span 20',
      }
    },
  },
  plugins: [],
};
export default config;
