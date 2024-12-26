import axios from "axios";
import axiosConfig from "@/configs/axios";
import {vuexStore} from "@/store/vuexStore";
import logger from "@nuxt/fonts/dist/module.mjs";


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


export async function downloadPhotos(assignmentBlockID, query) {
    try {

        const response = await axios.get('/assignment-blocks/archivePhoto/' + (assignmentBlockID ?? '') + (query ?? ''), {
            ...axiosConfig,
            responseType: 'blob',
        }).catch(err => {
            vuexStore.commit('alert/ERROR', 'Ошибка загрузки. Фотографии отсутствуют');
            console.log('Ошибка загрузки. Фотографии отсутствуют', err);
        })

        if (!response.data) return;

        const oURL = window.URL.createObjectURL(new Blob([response.data]));
        const selectorA = document.createElement('a');
        selectorA.download = 'address_photos.zip';
        selectorA.href = oURL;
        document.body.appendChild(selectorA);
        selectorA.click();
        selectorA.parentNode.removeChild(selectorA);
    } catch (err) {

    }
}