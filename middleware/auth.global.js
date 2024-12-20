import {accessTest} from "@/utils/api/api_";


export default defineNuxtRouteMiddleware(async (to, from) => {

    if (import.meta.server) {
        // console.log(sessionStorage.dsfsdf.asdasd)
        return;
    }

    if (import.meta.client) {


        console.log('client log')
        let tokenTest = await accessTest().then(r => r.data);

        if (tokenTest && /^\/$/ig.test(to?.fullPath) || /^\/manager-menu$/ig.test(to?.fullPath)) {
            return navigateTo('/manager-menu/assignments');
        }

        if (!tokenTest && !/^\/$/ig.test(to?.fullPath)) {
            return navigateTo('/');
        }
    }


})