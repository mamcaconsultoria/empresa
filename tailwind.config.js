/** Configuración de Tailwind CSS para el sitio de MAMCA S.A.S.
 *  Después de cambiar clases en el HTML, recompile el CSS:  npm run build
 */
module.exports = {
  content: ['./*.html', './script.js'],
  theme: {
    extend: {
      colors: {
        primary: '#0f392b',     // verde oscuro de marca (fondos, títulos)
        leaf: '#3b7a2a',        // verde accesible para botones y enlaces (contraste 5.2:1 con blanco)
        secondary: '#6aa84f',   // verde claro decorativo (no usar para texto sobre blanco)
        mint: '#8cc96f',        // verde claro para texto sobre fondos oscuros
        accent: '#2b6cb0',
        neutral: '#f3f4f6',
        whatsapp: '#25D366',
        'whatsapp-dark': '#128C7E',
        ink: '#06281e',         // texto oscuro sobre verde WhatsApp
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
