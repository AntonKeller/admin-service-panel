import {accessTest} from "@/utils/api/api_";


export default defineNuxtRouteMiddleware(async (to, from) => {

    if (import.meta.server) {
        // console.log(sessionStorage.dsfsdf.asdasd)
        return;
    }

    if (import.meta.client) {


        let tokenTest = await accessTest().then(r => r.data);

        if (!tokenTest && !/^\/$/ig.test(to?.fullPath)) {
            return navigateTo('/');
        }

        if (tokenTest) {

            const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

            if (isMobile && !/^\/mobile-downloads$/ig.test(to?.fullPath)) {
                return navigateTo('/mobile-downloads');
            }

            if (/^\/$/ig.test(to?.fullPath) || /^\/manager-menu$/ig.test(to?.fullPath)) {
                return navigateTo('/manager-menu/assignments');
            }

        }

    }
})