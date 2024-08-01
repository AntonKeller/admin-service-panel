import {accessTest} from "@/utils/methods/requests";
import {useState} from "nuxt/app";

export default defineNuxtPlugin(async () => {
    try {

        const storage = JSON.parse(localStorage.getItem("accessToken") || "");

        if (storage?.accessToken?.length > 0) {
            const state_access_token_test = useState('access_token_test');
            state_access_token_test.value = await accessTest(storage?.accessToken).then(r => r.data);
            // console.log('[plugin] state_access_token_test:', state_access_token_test.value);
        }

    } catch (err) {
        console.log('Отсутствует ключ')
    }
});