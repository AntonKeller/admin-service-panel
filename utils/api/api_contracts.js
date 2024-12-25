import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchContracts(query) {
    return axios.get('/contracts' + (query ?? ''), axiosConfig);
}

export async function fetchContractsAll(query) {
    return axios.get('/contracts/all' + (query ?? ''), axiosConfig);
}

export async function addContract(contract, query) {
    return axios.post('/contracts/add' + (query ?? ''), contract, axiosConfig);
}

export async function changeContract(contract, query) {
    return axios.put('/contracts/' + contract._id + (query ?? ''), contract, axiosConfig);
}

export async function removeContract(id, query) {
    return axios.delete('/contracts/' + id + (query ?? ''), axiosConfig);
}
