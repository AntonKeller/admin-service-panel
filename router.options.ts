import type { NuxtPage } from '@nuxt/schema'

export default defineNuxtConfig({
    hooks: {
        'pages:extend' (pages) {
            // add a route
            pages.push({
                name: 'profile',
                path: '/profile',
                file: '~/extra-pages/profile.vue'
            })

            // remove routes
            function removePagesMatching (pattern: RegExp, pages: NuxtPage[] = []) {
                const pagesToRemove: NuxtPage[] = []
                for (const page of pages) {
                    if (page.file && pattern.test(page.file)) {
                        pagesToRemove.push(page)
                    } else {
                        removePagesMatching(pattern, page.children)
                    }
                }
                for (const page of pagesToRemove) {
                    pages.splice(pages.indexOf(page), 1)
                }
            }
            removePagesMatching(/\.ts$/, pages)
        }
    }
})