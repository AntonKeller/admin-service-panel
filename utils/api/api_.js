import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        timeout: 1500,
        headers: {
            'Content-type': '*/*',
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Тестирует access token на вылидность
 * */
export async function accessTest() {
    return await axios.post(serverURL + '/auth/access-test', {}, createConfig());
}

/**
 * Загружает файл
 * */
export async function downloadFile(saveAs, url) {

    try {

        const response = await axios.get(url, {
            responseType: 'blob',
            timeout: 5000,
            headers: {
                authorization: localStorage.accessToken ?? '',
            }
        });

        const oURL = window.URL.createObjectURL(new Blob([response.data]));
        const selectorA = document.createElement('a');

        selectorA.href = oURL;
        document.body.appendChild(selectorA);
        selectorA.click();
        selectorA.parentNode.removeChild(selectorA);

    } catch (err) {
        console.log('Ошибка загрузки файла')
    }

}

