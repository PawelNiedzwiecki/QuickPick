/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // QuickPick Brand Colors
        primary: {
          DEFAULT: "#22C55E",
          foreground: "#FFFFFF",
          dark: "#16A34A",
          light: "#4ADE80",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#1E293B",
          dark: "#E2E8F0",
        },
        accent: {
          DEFAULT: "#F59E0B",
          foreground: "#FFFFFF",
          dark: "#D97706",
          light: "#FCD34D",
        },
        background: "#FFFFFF",
        foreground: "#1E293B",
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        ring: "#22C55E",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#1E293B",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
    },
  },
  plugins: [],
};
