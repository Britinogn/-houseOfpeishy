import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
   plugins: [
    vue(),
    tailwindcss({
      config: {
        content: [
          "./index.html",
          "./src/**/*.{vue,js,ts,jsx,tsx}",
        ],
        theme: {
          extend: {
            colors: {
              primary: {
                DEFAULT: 'var(--primary)',
                hover: 'var(--primary-hover)',
              },
              secondary: {
                DEFAULT: 'var(--secondary)',
                hover: 'var(--secondary-hover)',
              },
              accent: {
                DEFAULT: 'var(--accent)',
                hover: 'var(--accent-hover)',
              },
              background: {
                primary: 'var(--bg-primary)',
                secondary: 'var(--bg-secondary)',
              },
              text: {
                primary: 'var(--text-primary)',
                secondary: 'var(--text-secondary)',
              },
            },
          },
        },
      }
    }),
  ],
});



