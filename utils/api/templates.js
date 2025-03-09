import axios from "axios";
import axiosConfig from "@/configs/axios";

export function fetchTemplates() {
    return axios.get('/templates', axiosConfig);
}

export function fetchTemplate(id) {
    return axios.get(`/templates/findOneById/${id}`, axiosConfig);
}

export function createTemplate(data) {
    return axios.post(`/templates/createTemplate`, data, axiosConfig);
}

export function removeTemplate(id) {
    return axios.delete(`/templates/${id}`, axiosConfig);
}

export function removeSomeTemplates(ids) {
    return axios.post(`/templates/deleteMany`, ids, axiosConfig);
}

export function uploadExcelTemplate(templateId, file) {
    const formData = new FormData();
    formData.append('photoAngles', file);
    return axios.post(`/templates/uploadTemplates/${templateId}`, formData, axiosConfig);
}

export async function downloadExcelTemplate(saveAs) {
    const answer = await axios.get(`/templates/downloadExcelTemplate`, {
        ...axiosConfig,
        responseType: 'blob',
    });

    const oURL = window.URL.createObjectURL(new Blob([answer.data]));
    const selectorA = document.createElement('a');
    selectorA.download = saveAs;
    selectorA.href = oURL;
    document.body.appendChild(selectorA);
    selectorA.click();
    selectorA.parentNode.removeChild(selectorA);
    return answer;
}