import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a5bbfd",
          400: "#8098fb",
          500: "#6172f9",
          600: "#4f52ef",
          700: "#4140d4",
          800: "#3636ab",
          900: "#302f87",
          950: "#1e1d52",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        surface: {
          0: "#ffffff",
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          dark: {
            0: "#0d0d14",
            50: "#12121e",
            100: "#16162a",
            200: "#1e1e32",
            300: "#27273f",
          },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(97, 114, 249, 0.08)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px rgba(97, 114, 249, 0.3)",
        "glow-sm": "0 0 20px rgba(97, 114, 249, 0.2)",
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 6px rgba(0,0,0,0.06), 0 12px 32px rgba(0,0,0,0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #6172f9 0%, #8098fb 100%)",
        "dark-gradient":
          "linear-gradient(135deg, #1e1e32 0%, #12121e 100%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        "wave": "wave 0.8s ease-in-out",
        "spin-slow": "spin 3s linear infinite",
        "confetti": "confetti 1s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(97, 114, 249, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(97, 114, 249, 0.5)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wave: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(20deg)" },
          "50%": { transform: "rotate(-10deg)" },
          "75%": { transform: "rotate(15deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        confetti: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(-100px) rotate(720deg)",
            opacity: "0",
          },
        },
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      },
    },
  },
  plugins: [],
};

export default config;
