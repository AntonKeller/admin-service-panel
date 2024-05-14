import {accessTest} from "@/utils/methods/requests";

export default defineNuxtPlugin(async () => {

    const storage = JSON.parse(localStorage.getItem("token") || "");

    if (storage?.accessToken?.length > 0) {

        const response = await accessTest(storage?.accessToken);

        const accessToken = useState('accessToken');
        accessToken.value = response?.data;

        console.log('storageToken:', storage?.accessToken);
        console.log('response:', response?.data);
    }
});