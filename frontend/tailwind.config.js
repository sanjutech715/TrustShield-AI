/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: "#050810",
          panel: "#0B1120",
          raised: "#111A2E",
        },
        cyan: {
          glow: "#22D3EE",
        },
        violet: {
          glow: "#8B5CF6",
        },
        azure: {
          glow: "#3B82F6",
        },
        risk: {
          low: "#34D399",
          medium: "#FBBF24",
          high: "#FB923C",
          critical: "#F43F5E",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(34, 211, 238, 0.35)",
        "glow-violet": "0 0 24px -4px rgba(139, 92, 246, 0.35)",
      },
    },
  },
  plugins: [],
};
