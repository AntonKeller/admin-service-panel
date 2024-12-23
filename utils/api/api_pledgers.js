import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Pledgers
 * */
export async function fetchPledgers(query) {
    return axios.get(serverURL + '/pledgers' + (query ?? ''), createConfig());
}

export async function addPledger(pledger, query) {
    return axios.post(serverURL + '/pledgers/add' + (query ?? ''), pledger, createConfig());
}

export async function changePledger(pledger, query) {
    return axios.put(serverURL + '/pledgers/update/:id' + pledger._id + (query ?? ''), pledger, createConfig());
}

export async function removePledger(pledgerID, query) {
    return axios.delete(serverURL + '/pledgers/remove/:id' + pledgerID + (query ?? ''), createConfig());
}
