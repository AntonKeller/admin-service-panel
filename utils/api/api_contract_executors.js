import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        timeout: 1500, headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

export function fetchContractExecutors(query) {
    return axios.get(serverURL + '/contracts/contract-executors' + (query ?? ''), createConfig());
}

export function addContractExecutor(contractExecutor, query) {
    return axios.post(serverURL + '/contracts/contract-executor-add' + (query ?? ''), contractExecutor, createConfig());
}


