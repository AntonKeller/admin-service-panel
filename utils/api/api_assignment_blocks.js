import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchAssignmentBlocks(assignmentID, query) {
    return axios.get('/assignment-blocks/' + assignmentID + (query ?? ''), axiosConfig);
}

export function fetchAssignmentBlockOneById(assignmentBlockID, query) {
    return axios.get('/assignment-blocks/findOneById/' + (assignmentBlockID ?? '') + (query ?? ''), axiosConfig);
}

export function sendAssignmentBlock(assignmentId, block, query) {
    return axios.post('/assignment-blocks/add/' + assignmentId + (query ?? ''), block, axiosConfig);
}

export function changeAssignmentBlock(assignmentId, block, query) {
    return axios.put('/assignment-blocks/' + assignmentId + '/change/' + block._id + (query ?? ''), block, axiosConfig);
}

export function removeAssignmentBlock(blockId, query) {
    return axios.delete(`/assignment-blocks/` + blockId + (query ?? ''), axiosConfig);
}

// Загружает на сервер файл Excel со списокм объектов
export function uploadObjects(blockID, objectsExcelBlob, query) {
    return axios.post('/inspection-objects/uploadObjects/' + (blockID ?? '') + (query ?? ''), objectsExcelBlob, axiosConfig);
}