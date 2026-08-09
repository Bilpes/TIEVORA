import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tievora: { 900: "#0a0f1e", 800: "#0f1a33", 700: "#162447", gold: "#d4a843", cyan: "#3dd5d6", violet: "#7c5cfc" }
      },
      fontFamily: { sans: ["Inter","system-ui","sans-serif"] },
      animation: { pulseGlow: "pulseGlow 2s infinite", float: "float 6s ease-in-out infinite" },
      keyframes: { pulseGlow: { "0%,100%": { opacity: "0.8" }, "50%": { opacity: "1" } }, float: { "0%,100%": { transform:"translateY(0)" }, "50%": { transform:"translateY(-6px)" } } }
    },
  },
  plugins: [],
};
export default config;
