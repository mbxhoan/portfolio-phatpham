import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F8FAFC",
        surface: "#F1F5F9",
        navy: { DEFAULT: "#0F172A", 2: "#1E293B", 3: "#334155" },
        brand: { DEFAULT: "#2563EB", bright: "#3B82F6", dark: "#1D4ED8", light: "#EFF6FF" },
        accent: { DEFAULT: "#06B6D4", bright: "#22D3EE", teal: "#0D9488", emerald: "#10B981" },
        soft: { DEFAULT: "#DBEAFE", 2: "#E0E7FF", pale: "#F0F9FF" },
        ink: "#0F172A",
        body: { DEFAULT: "#334155", 2: "#64748B" },
        ctadark: "#0F172A",
        // admin
        adminbg: "#F8FAFC",
        adminside: "#F1F5F9",
        adminink: "#0F172A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: { pill: "9999px", xl2: "24px", xl3: "32px", xl4: "48px" },
      boxShadow: {
        card: "0 10px 30px -10px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 25px 50px -15px rgba(37, 99, 235, 0.15)",
        glow: "0 0 25px rgba(37, 99, 235, 0.25)",
        soft: "0 2px 8px -2px rgba(15, 23, 42, 0.06)",
        pop: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
        nav: "0 10px 30px -10px rgba(15, 23, 42, 0.08)",
      },
      maxWidth: { container: "1280px" },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "none" },
        },
      },
      animation: { "fade-up": "fade-up .35s cubic-bezier(.22,.61,.36,1)" },
    },
  },
  plugins: [],
};

export default config;
