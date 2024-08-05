export default defineNuxtRouteMiddleware((to, from) => {

    if (import.meta.server) return;

    if (import.meta.client) {

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // return ;
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        // if (/^\/$/ig.test(to?.fullPath)) {
        //
        //     const access_token_test = useState('access_token_test')?.value;
        //     if (access_token_test) return navigateTo('/manager-menu');
        //
        // }
        //
        // if (/^\/manager-menu/ig.test(to?.fullPath)) {
        //
        //     const access_token_test = useState('access_token_test')?.value;
        //     if (!access_token_test) return navigateTo('/');
        //
        // }

    }

})