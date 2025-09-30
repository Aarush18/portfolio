import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: { bg: "#0b0b0f" },
      borderRadius: { xl2: "1rem" },
      boxShadow: { soft: "0 8px 30px rgba(0,0,0,0.35)" },
    },
  },
  plugins: [],
} satisfies Config;
