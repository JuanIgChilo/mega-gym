/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta basada en los mockups del informe: fondo oscuro + acento verde
        brand: {
          bg: "#121212",
          surface: "#1e1e1e",
          accent: "#22c55e",
        },
      },
    },
  },
  plugins: [],
};
