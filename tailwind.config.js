/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        police: {
          50: "#e8eef5",
          100: "#c5d4e6",
          200: "#9db7d4",
          300: "#7099c2",
          400: "#4a7cb0",
          500: "#1f5d99",
          600: "#0f4a85",
          700: "#003366",
          800: "#002952",
          900: "#001d3d",
          950: "#001226",
        },
        gold: {
          50: "#fef8e7",
          100: "#fdecb8",
          200: "#fbdd80",
          300: "#f9cd47",
          400: "#f4b400",
          500: "#d99e00",
          600: "#b88300",
          700: "#946800",
          800: "#6f4e00",
          900: "#4a3400",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 10px 25px -5px rgba(0,51,102,0.15), 0 8px 10px -6px rgba(0,51,102,0.1)",
        glow: "0 0 0 4px rgba(244,180,0,0.15)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "pulse-ring": "pulse-ring 1.8s ease-out infinite",
      },
    },
  },
  plugins: [],
};
