import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "neon-green": "#39FF14",
        "neon-purple": "#BF40FF",
        "neon-cyan": "#00FFFF",
        "neon-pink": "#FF6EC7",
        "neon-yellow": "#DFFF00",
        "arena-dark": "#0A0A0F",
        "arena-darker": "#050508",
        "arena-card": "#12121A",
        "arena-border": "#1E1E2E",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "flicker": "flicker 3s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": {
            textShadow:
              "0 0 4px #39FF14, 0 0 8px #39FF14, 0 0 16px #39FF14",
          },
          "50%": {
            textShadow:
              "0 0 8px #39FF14, 0 0 16px #39FF14, 0 0 32px #39FF14, 0 0 48px #39FF14",
          },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "0.99",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        "neon-green": "0 0 5px #39FF14, 0 0 20px rgba(57, 255, 20, 0.3)",
        "neon-purple": "0 0 5px #BF40FF, 0 0 20px rgba(191, 64, 255, 0.3)",
        "neon-cyan": "0 0 5px #00FFFF, 0 0 20px rgba(0, 255, 255, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
