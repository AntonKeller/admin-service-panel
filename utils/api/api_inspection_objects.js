import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchInspectionObjects(blockID, query) {
    return axios.get('/inspection-objects/blockId/' + (blockID || '') + (query ?? ''), axiosConfig);
}

export function fetchInspectionObjectOneById(inspectionObjectID, query) {
    return axios.get('/inspection-objects/findOneById/' + (inspectionObjectID ?? '') + (query ?? ''), axiosConfig);
}

export async function sendInspectionObject(blockId, inspectionObject, query) {
    return axios.post('/inspection-objects/add/' + blockId + (query ?? ''), inspectionObject, axiosConfig);
}

export async function changeInspectionObject(inspectionObject, query) {
    return axios.put('/inspection-objects/' + inspectionObject._id + (query ?? ''), inspectionObject, axiosConfig);
}

export async function uploadObjects(blockID, file, query) {
    return axios.post('/inspection-objects/inspectionObjectsUpload/' + (blockID ?? '') + (query ?? ''), file, axiosConfig);
}

export async function removeObject(objectID, query) {
    return axios.delete('/inspection-objects/removeObject/' + (objectID ?? '') + (query ?? ''), axiosConfig);
}

export function removeObjects(blockID, query) {
    return axios.delete('/assignment-blocks/deleteAll/' + (blockID ?? '') + (query ?? ''), axiosConfig);
}