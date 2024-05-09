// import {accessTest} from "@/utils/methods/requests";
//
//
export default defineNuxtRouteMiddleware(async (to, from) => {

    return;

//     let tokenBlock = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('token')) : null;
//     let accessToken = tokenBlock?.accessToken;
//     let status = await accessTest(accessToken).catch(err => err?.response?.status);
//
//     return status == 401 ? abortNavigation() : null;
//
//
//     // if (status == 401) {
//     //     console.log("Не авторизован", status)
//     //     return abortNavigation();
//     // }
//
//     // if (status === 401) return abortNavigation();
//     // return abortNavigation();
})