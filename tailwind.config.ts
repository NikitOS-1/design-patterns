import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B0E14",
          50: "#F4F5F7",
          100: "#E4E7EC",
          200: "#C4C9D4",
          300: "#8B93A7",
          400: "#5B6478",
          500: "#3A4155",
          600: "#232838",
          700: "#181C28",
          800: "#131720",
          900: "#0B0E14",
          950: "#06080D",
        },
        blueprint: {
          DEFAULT: "#1B3A6B",
          light: "#2C5590",
          grid: "#1A2540",
        },
        amber: {
          DEFAULT: "#F5A623",
          soft: "#FFD08A",
          dim: "#8A6320",
        },
        teal: {
          DEFAULT: "#5EEAD4",
          dim: "#2C6E63",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(94, 234, 212, 0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(94, 234, 212, 0.055) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      boxShadow: {
        "amber-glow": "0 0 0 1px rgba(245,166,35,0.4), 0 0 24px rgba(245,166,35,0.12)",
      },
      typography: () => ({
        invert: {
          css: {
            "--tw-prose-body": "#C4C9D4",
            "--tw-prose-headings": "#E4E7EC",
            "--tw-prose-links": "#F5A623",
            "--tw-prose-bold": "#E4E7EC",
            "--tw-prose-code": "#5EEAD4",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
