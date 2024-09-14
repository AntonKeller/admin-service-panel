import {accessTest} from "@/utils/service/server";


export default defineNuxtRouteMiddleware(async (to, from) => {

    // return

    if (import.meta.server) return;

    if (import.meta.client) {

        let tokenTest = await accessTest(localStorage.accessToken).then(r => r.data);

        if (tokenTest && /^\/$/ig.test(to?.fullPath) || /^\/manager-menu$/ig.test(to?.fullPath)) {
            return navigateTo('/manager-menu/assignments');
        }

        if (!tokenTest && !/^\/$/ig.test(to?.fullPath)) {
            return navigateTo('/');
        }
    }


})