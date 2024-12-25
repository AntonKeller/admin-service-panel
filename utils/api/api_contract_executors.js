import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchContractExecutors(query) {
    return axios.get('/contracts/contract-executors' + (query ?? ''), axiosConfig);
}

export function addContractExecutor(contractExecutor, query) {
    return axios.post('/contracts/contract-executor-add' + (query ?? ''), contractExecutor, axiosConfig);
}


