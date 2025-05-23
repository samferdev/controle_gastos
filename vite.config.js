import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: './components/pagina-inicial.html',
                login: './components/login/login.html'
            }
        }
    },
    server: {
        port: 3000,
        open: '/components/login/login.html'
    }
}); 