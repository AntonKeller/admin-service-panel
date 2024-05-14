
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (!process.server) {
        const accessToken = useState('accessToken');
        console.log('accessToken.value:', accessToken.value);
        return /manager-menu/ig.test(to?.fullPath) && !accessToken.value ? abortNavigation() : undefined;
    }
    return undefined;
    // console.log('route:', /manager-menu/ig.test(to?.fullPath));
    // console.log('route store:', user?.value);
    // console.log('user?.value:', user?.value);
    // console.log('status permit:', /manager-menu/ig.test(to?.fullPath) && user?.value)
    // console.log('path:', to?.fullPath)
})