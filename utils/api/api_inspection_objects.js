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
 * Inspection objects
 * */
export async function fetchInspectionObjects(query) {
    return axios.get(serverURL + '/inspection-objects' + (query ?? ''), createConfig());
}

export async function sendInspectionObject(blockId, inspectionObject, query) {
    return axios.post(serverURL + '/inspection-objects/add/' + blockId + (query ?? ''), inspectionObject, createConfig());
}

export async function changeInspectionObject(inspectionObject, query) {
    return axios.put(serverURL + '/inspection-objects/' + inspectionObject._id + (query ?? ''), inspectionObject, createConfig());
}
