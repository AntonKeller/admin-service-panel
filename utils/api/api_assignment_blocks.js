import axios from "axios";
import axiosConfig from "@/configs/axios";
import {vuexStore} from "@/store/vuexStore";

export function fetchAssignmentBlocks(assignmentID, query) {
    return axios.get('/assignment-blocks/' + assignmentID + (query ?? ''), axiosConfig);
}

export function fetchAssignmentAddress(assignmentBlockID, query) {
    return axios.get('/assignment-blocks/findOneById/' + (assignmentBlockID ?? '') + (query ?? ''), axiosConfig);
}

export function sendAssignmentBlock(assignmentId, block, query) {
    return axios.post('/assignment-blocks/add/' + assignmentId + (query ?? ''), block, axiosConfig);
}

export function changeAssignmentBlock(block) {
    return axios.put('/assignment-blocks/change/' + block._id, block, axiosConfig);
}

export function removeAssignmentBlock(blockId, query) {
    return axios.delete(`/assignment-blocks/` + blockId + (query ?? ''), axiosConfig);
}

export function removeSomeBlocks(ids) {
    return axios.post(`/assignment-blocks/deleteMany`, ids, axiosConfig);
}

export async function downloadPhotos(assignmentBlockID, progressObject) {
    try {

        progressObject.process = true;

        const response = await axios.get('/assignment-blocks/archivePhoto/' + (assignmentBlockID ?? ''), {
            ...axiosConfig,
            responseType: 'blob',
            onDownloadProgress: function (progressEvent) {
                progressObject.percent = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
            },
        }).catch(err => {
            vuexStore.commit('alert/ERROR', 'Ошибка загрузки. Фотографии отсутствуют');
            console.log('Ошибка загрузки. Фотографии отсутствуют', err);
        }).finally(() => {
            progressObject.process = false;
            progressObject.percent = 0;
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
        console.log('Ошибка загрузки')
    }
}