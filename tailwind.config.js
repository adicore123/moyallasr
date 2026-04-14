/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './terms.html',
        './privacy.html',
        './accessibility.html',
        './src/**/*.{js,ts}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Heebo', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            colors: {
                brand: {
                    bg: '#F5F7F7',
                    lavender: '#D0CBF2',
                    pink: '#F7DAF3',
                    text: '#2D3748',
                    heading: '#1A202C',
                    phone: '#1F75ED',
                    'phone-hover': '#1A66CC',
                    wa: '#25D366',
                    'wa-hover': '#20BA56',
                    'wa-teal': '#128C7E',
                },
            },
        },
    },
    plugins: [
        function heroTextLegibility({ addUtilities }) {
            addUtilities({
                '.text-shadow-hero-mobile': {
                    textShadow:
                        '0 0 0.55em rgba(255, 255, 255, 0.94), 0 0 0.2em rgba(255, 255, 255, 0.98), 0 0.06em 0.14em rgba(255, 255, 255, 0.9)',
                },
            });
        },
    ],
};
