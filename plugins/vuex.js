import {vuexStore} from '../store/vuexStore'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(vuexStore);
    // Install the store instance as a plugin
});