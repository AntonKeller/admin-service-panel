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
 * Inspection objects
 * */
export async function fetchInspectionObjects(blockID, query) {
    return axios.get(serverURL + '/inspection-objects/blockId/' + (blockID || '') + (query ?? ''), createConfig());
}

export async function sendInspectionObject(blockId, inspectionObject, query) {
    return axios.post(serverURL + '/inspection-objects/add/' + blockId + (query ?? ''), inspectionObject, createConfig());
}

export async function changeInspectionObject(inspectionObject, query) {
    return axios.put(serverURL + '/inspection-objects/' + inspectionObject._id + (query ?? ''), inspectionObject, createConfig());
}

export async function uploadObjects(blockID, file, query) {
    return axios.post(serverURL + '/inspection-objects/inspectionObjectsUpload/' + (blockID ?? '') + (query ?? ''), file, createConfig());
}

export async function removeObject(objectID, query) {
    return axios.delete(serverURL + '/inspection-objects/removeObject/' + (objectID ?? '') + (query ?? ''), createConfig());
}

export function removeObjects(blockID, query) {
    return axios.delete(serverURL + '/assignment-blocks/deleteAll/' + (blockID ?? '') + (query ?? ''), createConfig());
}