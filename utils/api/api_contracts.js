import axios from "axios";
import {serverURL} from "@/constants/constants.js";

function createConfig() {
    return {
        timeout: 1500,
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Contract
 * */
export async function fetchContracts(query) {
    return axios.get(serverURL + '/contracts' + (query ?? ''), createConfig());
}

export async function fetchContractsAll(query) {
    return axios.get(serverURL + '/contracts/all' + (query ?? ''), createConfig());
}

export async function addContract(contract, query) {
    return axios.post(serverURL + '/contracts/add' + (query ?? ''), contract, createConfig());
}

export async function changeContract(contract, query) {
    return axios.put(serverURL + '/contracts/' + contract._id + (query ?? ''), contract, createConfig());
}

export async function removeContract(id, query) {
    return axios.delete(serverURL + '/contracts/' + id + (query ?? ''), createConfig());
}
