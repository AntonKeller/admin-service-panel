import {accessTest} from "@/utils/methods/requests";

export default defineNuxtPlugin(async () => {
    // try {
    //     const storage = JSON.parse(localStorage.getItem("accessToken") || "");
    //     if (storage?.accessToken?.length > 0) {
    //         const response = await accessTest(storage?.accessToken);
    //         const accessToken = useState('accessToken');
    //         accessToken.value = response?.data;
    //     }
    // } catch (err) {
    //     console.log('Отсутствует ключ');
    // }
});