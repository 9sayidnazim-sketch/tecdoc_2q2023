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
        primary: {
          DEFAULT: "var(--color-primary, #1F4FE0)",
          hover: "#183EB5",
          light: "#EEF3FF",
          disabled: "var(--color-disabled, #7FA6F5)",
        },
        accent: {
          DEFAULT: "var(--color-accent, #F26B3A)",
          hover: "#DE5A2A",
          light: "#FFF4EF",
        },
        surface: "#FFFFFF",
        subtle: "#F9FAFB",
        border: "#E5E7EB",
        cardBorder: "#E2E8F0",
        heading: "#111827",
        placeholder: "#6B7280",
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
