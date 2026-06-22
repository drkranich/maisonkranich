import type { Config } from "tailwindcss";

/**
 * MAISON KRANICH · Design System
 * Paleta oficial da marca — fonte de verdade visual.
 * "Onde toda história encontra seu abrigo."
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Bases escuras
        carvao: {
          DEFAULT: "#1B1B1B",
          deep: "#111111", // Preto Profundo
          fosco: "#222222",
        },
        // Madeiras
        nogueira: "#4A3326",
        madeira: "#5A4030",
        musgo: "#344034", // Verde Musgo Escuro
        // Metais
        bronze: "#A77942", // Bronze Antigo
        latao: "#B08A57", // Latão Envelhecido
        dourado: {
          DEFAULT: "#C9A36A", // Dourado Envelhecido
          soft: "#D9BC8C",
        },
        // Papéis
        kraft: "#D6BE97",
        pergaminho: "#E9DCC6",
        marfim: "#F6F1E7",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Playfair Display", "serif"],
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.18em",
        wide2: "0.28em",
      },
      boxShadow: {
        atelier: "0 24px 60px -20px rgba(0,0,0,0.65)",
        card: "0 12px 32px -12px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px rgba(201,163,106,0.18), 0 18px 50px -24px rgba(201,163,106,0.35)",
        inset: "inset 0 1px 0 rgba(246,241,231,0.04)",
      },
      backgroundImage: {
        "amber-glow":
          "radial-gradient(120% 120% at 50% 0%, rgba(201,163,106,0.18) 0%, rgba(27,27,27,0) 55%)",
        "candle":
          "radial-gradient(60% 60% at 50% 40%, rgba(201,163,106,0.28) 0%, rgba(17,17,17,0) 70%)",
        "kraft-paper":
          "linear-gradient(180deg, #E9DCC6 0%, #DCCBA8 100%)",
        "panel":
          "linear-gradient(165deg, rgba(40,33,26,0.92) 0%, rgba(17,17,17,0.96) 100%)",
      },
      keyframes: {
        sway: {
          "0%,100%": { transform: "rotate(-2.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        flicker: {
          "0%,100%": { opacity: "1" },
          "45%": { opacity: "0.82" },
          "70%": { opacity: "0.95" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        sway: "sway 3.5s ease-in-out infinite",
        flicker: "flicker 4s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
