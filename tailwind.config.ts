import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        mist: {
          DEFAULT: "#F5F5F7",
          dark: "#E8E8ED",
        },
        ink: "#0A0A0A",
        graphite: "#1D1D1F",
        stone: {
          DEFAULT: "#6E6E73",
          light: "#86868B",
        },
        burgundy: {
          DEFAULT: "#8C2038",
          dark: "#5C1224",
          light: "#F4E3E6",
        },
        terracotta: "#D97B4F",
        gold: "#C9A567",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1180px",
        wide: "1400px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(3%, -4%) scale(1.05)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 1s cubic-bezier(0.16,1,0.3,1) both",
        drift: "drift 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
