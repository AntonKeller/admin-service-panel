import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';

export default defineNuxtConfig({

    devtools: {
        enabled: true
    },

    ssr: false,

    // routeRules: {
        //     '/': { ssr: true, prerender: true },
    // },

    app: {

        head: {

            title: '',

            htmlAttrs: {
                lang: 'ru'
            },

            meta: [
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    charset: 'utf-8'
                },
                {
                    name: 'format-detection',
                    content: 'telephone=+99999999999999'
                },
                {
                    name: 'author',
                    content: 'ООО "Рога и копыта"'
                }
            ],

            link: [
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&display=swap",
                },
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon_16x16.ico'
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
                },
            ]
        },
    },

    typescript: {
        typeCheck: true
    },

    css: [
        '/assets/css/main.scss'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // build: {
    //     transpile: ['vuetify'],
    //     vue: {
    //         compilerOptions: {
    //             isCustomElement: tag => {
    //                 // Указываем условия для кастомных элементов
    //                 return ['assignment-add', 'component-assignment-change'].includes(tag)
    //             }
    //         }
    //     }
    // },

    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}))
            })
        },
    ],
})
