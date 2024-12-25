import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchPledgers(query) {
    return axios.get('/pledgers' + (query ?? ''), axiosConfig);
}

export async function addPledger(pledger, query) {
    return axios.post('/pledgers/add' + (query ?? ''), pledger, axiosConfig);
}

export async function changePledger(pledger, query) {
    return axios.put('/pledgers/update/' + pledger._id + (query ?? ''), pledger, axiosConfig);
}

export async function removePledger(pledgerID, query) {
    return axios.delete('/pledgers/remove/' + pledgerID + (query ?? ''), axiosConfig);
}
