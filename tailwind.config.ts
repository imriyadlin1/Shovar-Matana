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
        brand: {
          deep: "#0a2744",
          DEFAULT: "#1565c0",
          light: "#42a5f5",
          faint: "#e3f2fd",
        },
        accent: {
          DEFAULT: "#0f766e",
          soft: "#5eead4",
          faint: "#ccfbf1",
        },
        money: { DEFAULT: "#00897b", dark: "#00695c", faint: "#e0f2f1" },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f1f5f9",
          subtle: "#e8eef4",
        },
        ink: {
          DEFAULT: "#0f172a",
          muted: "#475569",
          faint: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.06)",
        "card-hover":
          "0 4px 6px rgba(15, 23, 42, 0.05), 0 16px 36px rgba(21, 101, 192, 0.09)",
        nav: "0 1px 0 rgba(15, 23, 42, 0.06), 0 4px 16px rgba(15, 23, 42, 0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
