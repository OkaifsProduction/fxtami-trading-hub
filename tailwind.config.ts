import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF6EE",
          dark: "#F1E7D6",
        },
        ink: "#1C1714",
        charcoal: "#241E1B",
        burgundy: {
          DEFAULT: "#7A1930",
          dark: "#4F1020",
          light: "#F4E2E5",
        },
        gold: "#C6A468",
        stone: {
          DEFAULT: "#6E655D",
          light: "#B8AEA3",
        },
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
      },
      maxWidth: {
        content: "1280px",
      },
      boxShadow: {
        card: "0 8px 30px -12px rgba(28, 23, 20, 0.18)",
        "card-hover": "0 20px 40px -16px rgba(28, 23, 20, 0.28)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
