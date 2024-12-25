import axios from "axios";
import axiosConfig from "@/configs/axios.ts";

export function requestTestWithAxiosConfig(data = {name: 'Ivan', surname: 'Ivanov'}, query = '?size=5&limit=20') {
    return axios.post('/test-request' + query, data, axiosConfig);
}