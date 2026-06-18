import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        muted: "#667085",
        paper: "#fffaf6",
        coral: "#ff6b6b",
        mango: "#ffb84d",
        mint: "#2ec4b6",
        sky: "#4d96ff"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 33, 47, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
