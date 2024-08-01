import {accessTest} from "@/utils/methods/requests";

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default defineNuxtRouteMiddleware((to, from) => {

    if (import.meta.server) return;

    // console.log('middle ware working...')

    if (import.meta.client) {

        if (/^\/$/ig.test(to?.fullPath)) {

            const access_token_test = useState('access_token_test')?.value;
            if (access_token_test) return navigateTo('/manager-menu');

        }

        if (/^\/manager-menu$/ig.test(to?.fullPath)) {

            const access_token_test = useState('access_token_test')?.value;
            if (!access_token_test) return navigateTo('/');

        }

    }

})