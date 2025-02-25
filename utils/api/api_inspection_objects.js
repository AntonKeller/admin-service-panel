import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchInspectionObjects(blockID, query) {
    return axios.get('/inspection-objects/blockId/' + (blockID || '') + (query ?? ''), axiosConfig);
}

export function fetchInspectionObjectOneById(inspectionObjectID) {
    return axios.get('/inspection-objects/findOneById/' + inspectionObjectID, axiosConfig);
}

export function sendInspectionObject(blockId, inspectionObject, query) {
    return axios.post('/inspection-objects/add/' + blockId + (query ?? ''), inspectionObject, axiosConfig);
}

export function changeInspectionObject(inspectionObject) {
    return axios.put('/inspection-objects/' + inspectionObject._id, inspectionObject, axiosConfig);
}

export function uploadObjects(blockID, file, query) {
    return axios.post('/inspection-objects/inspectionObjectsUpload/' + (blockID ?? '') + (query ?? ''), file, axiosConfig);
}

export function removeObject(objectID, query) {
    return axios.delete('/inspection-objects/removeObject/' + (objectID ?? '') + (query ?? ''), axiosConfig);
}

export function removeObjects(blockID, query) {
    return axios.delete('/assignment-blocks/deleteAll/' + (blockID ?? '') + (query ?? ''), axiosConfig);
}