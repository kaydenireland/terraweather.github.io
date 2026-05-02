import { defineConfig } from 'vite';

export default defineConfig({
    base: '/terraweather/',
    server: {
        proxy: {
            '/gvp-api': {
                target: 'https://webservices.volcano.si.edu',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/gvp-api/, ''),
            }
        }
    }
});