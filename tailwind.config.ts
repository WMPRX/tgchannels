import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f5f5',
          dark: '#1a1a2e',
        },
        card: {
          light: '#ffffff',
          dark: '#16213e',
        },
        text: {
          light: '#333333',
          dark: '#e0e0e0',
        },
        accent: '#ff6b35',
        whatsapp: {
          primary: '#25D366',
          secondary: '#128C7E',
        },
        telegram: {
          primary: '#0088cc',
          secondary: '#229ED9',
        },
        discord: {
          primary: '#5865F2',
          secondary: '#7289da',
        },
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover': '0 6px 20px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        heading: ['Poppins', 'Nunito', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'whatsapp-gradient': 'linear-gradient(135deg, #25D366, #128C7E)',
        'telegram-gradient': 'linear-gradient(135deg, #229ED9, #0088cc)',
        'discord-gradient': 'linear-gradient(135deg, #5865F2, #7289da)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
