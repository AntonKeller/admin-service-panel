// vite.config.js
export default {
    build: {
        rollupOptions: {
            external: ['moment'],  // Указываем, что 'moment' должен быть внешним модулем
        }
    }
}