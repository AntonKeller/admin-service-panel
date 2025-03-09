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

export function changeSomeObjects(objects) {
    return axios.put('/inspection-objects/updateMany', objects, axiosConfig);
}

// Загружает на сервер файл Excel со списокм объектов
export function uploadObjects(blockID, file) {
    const formData = new FormData();
    formData.append('excelObjects', file);
    return axios.post(`/inspection-objects/uploadObjects/${blockID}`, formData, axiosConfig);
}

export function removeObject(objectID, query) {
    return axios.delete('/inspection-objects/removeObject/' + (objectID ?? '') + (query ?? ''), axiosConfig);
}

export function removeObjects(blockID, query) {
    return axios.delete('/assignment-blocks/deleteAll/' + (blockID ?? '') + (query ?? ''), axiosConfig);
}