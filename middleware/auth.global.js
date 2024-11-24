import {accessTest} from "@/utils/api/api_";


export default defineNuxtRouteMiddleware(async (to, from) => {

    if (import.meta.server) return;

    if (import.meta.client) {

        let tokenTest = await accessTest().then(r => r.data);

        if (tokenTest && /^\/$/ig.test(to?.fullPath) || /^\/manager-menu$/ig.test(to?.fullPath)) {
            return navigateTo('/manager-menu/assignments');
        }

        if (!tokenTest && !/^\/$/ig.test(to?.fullPath)) {
            return navigateTo('/');
        }
    }


})