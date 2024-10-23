/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2C3E50", // Azul Marino
        secondary: "#2ECC71", // Verde Esmeralda
        accent: "#F1C40F", // Dorado
        neutral: "#FFFFFF", // Blanco
        complement: "#ECF0F1", // Gris Claro
      },
    },
  },
  plugins: [],
};
