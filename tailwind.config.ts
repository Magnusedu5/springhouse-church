import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "brand-blue": "#1A2E4A",   // warm deep navy (was cool #1A3A6B)
        "brand-red": "#B85C38",    // terracotta (was harsh #C0272D)
        "brand-gold": "#C8892A",   // rich amber (was flat #D4A017)
        "brand-cream": "#FDF6EC",  // warm parchment (was cool #FAF8F4)
        "brand-warm": "#FFF9F3",   // warm white for alternating sections
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      backgroundImage: {
        "cross-pattern": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='18' y='4' width='4' height='32' fill='%23C8892A' opacity='0.08'/%3E%3Crect x='4' y='18' width='32' height='4' fill='%23C8892A' opacity='0.08'/%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
export default config;
