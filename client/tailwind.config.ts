import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "#000000",
        primaryWhite: "var(--primaryWhite)",
        primaryBlack: "var(--primaryBlack)",
        secondaryBlack: "var(--secondaryBlack)",
        primaryGray: "var(--primaryGray)",
      },
      fontFamily: {
        DM: ["var(--font-dmsans)", "sans-serif"],
        sans: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
  darkMode: "class",
  purge: {
    options: {
      safelist: ["dark:text-primaryWhite"],
    },
  },
};
export default config;
