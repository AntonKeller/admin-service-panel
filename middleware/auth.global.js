export default defineNuxtRouteMiddleware(async (to, from) => {
    // console.log('route:', /manager-menu/ig.test(to?.fullPath));
    // console.log('route store:', user?.value);
    // console.log('user?.value:', user?.value)
    // console.log('status permit:', /manager-menu/ig.test(to?.fullPath) && user?.value)
    // console.log('path:', to?.fullPath)

    return /manager-menu/ig.test(to?.fullPath) && !useState('user')?.value  ? abortNavigation() : undefined;
})