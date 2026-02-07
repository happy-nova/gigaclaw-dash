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
        // Gigaverse palette
        giga: {
          900: "#0E1925", // darkest navy
          800: "#0C384C", // dark teal
          700: "#0F4A5C", // mid teal
          600: "#0483AB", // medium blue
          500: "#02C7D7", // bright cyan
          400: "#2DD4E4", // lighter cyan
          accent: {
            red: "#C45555",
            green: "#2ECC71",
            orange: "#F5A623",
            yellow: "#F8D14E",
            gold: "#FFD966",
          },
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "giga-gradient": "linear-gradient(135deg, #0E1925 0%, #0C384C 100%)",
        "giga-glow":
          "radial-gradient(ellipse at center, rgba(2, 199, 215, 0.15) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(180deg, rgba(12, 56, 76, 0.6) 0%, rgba(14, 25, 37, 0.8) 100%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(2, 199, 215, 0.3)",
        "glow-sm": "0 0 20px rgba(2, 199, 215, 0.2)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
