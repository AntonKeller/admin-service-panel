import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        timeout: 1500,
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Inspectors
 * */
export async function fetchInspectors(query) {
    return axios.get(serverURL + '/inspectors' + (query ?? ''), createConfig());
}

export async function addInspector(inspector, query) {
    return axios.post(serverURL + '/inspectors/add' + (query ?? ''), inspector, createConfig());
}

export async function changeInspector(inspector, query) {
    return axios.put(serverURL + '/inspectors/' + inspector._id + (query ?? ''), inspector, createConfig());
}

export async function removeInspector(inspectorID, query) {
    return axios.delete(serverURL + '/inspectors/' + inspectorID + (query ?? ''), createConfig());
}