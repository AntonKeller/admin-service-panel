import type {AxiosRequestConfig} from "axios";

const axiosConfig: AxiosRequestConfig = {
    baseURL: 'https://api-inspector.gkbreeze.ru/',
    headers: {
        authorization: localStorage.accessToken ?? '',
    }
}

export default axiosConfig;