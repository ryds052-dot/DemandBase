import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050706",
        emerald: "#00F576",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "sans-serif"],
        display: ["Plus Jakarta Sans Variable", "Inter Variable", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
