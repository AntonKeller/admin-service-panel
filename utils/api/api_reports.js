import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchReports(query) {
    return axios.get('/reports' + (query ?? ''), axiosConfig);
}