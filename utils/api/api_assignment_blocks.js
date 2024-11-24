import axios from "axios";
import {serverURL} from "@/constants/constants.js";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Assignment Blocks
 * */
export function fetchAssignmentBlocks(assignmentID, query) {
    return axios.get(serverURL + '/assignment-blocks/' + assignmentID + (query ?? ''), createConfig());
}

export function removeAssignmentBlock(blockId, query) {
    return axios.delete(serverURL + `/assignment-blocks/` + blockId + (query ?? ''), createConfig());
}

export function sendAssignmentBlock(assignmentId, block, query) {
    return axios.post(serverURL + '/assignment-blocks/add/' + assignmentId + (query ?? ''), block, createConfig());
}

export function changeAssignmentBlock(assignmentId, block, query) {
    return axios.put(serverURL + '/assignment-blocks/' + assignmentId + '/change/' + block._id + (query ?? ''), block, createConfig());
}

// Загружает на сервер файл Excel со списокм объектов
export function uploadObjects(blockID, objectsExcelBlob, query) {
    return axios.post(serverURL + '/inspection-objects/uploadObjects/' + (blockID ?? '') + (query ?? ''), objectsExcelBlob, createConfig());
}