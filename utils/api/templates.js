import axios from "axios";
import axiosConfig from "@/configs/axios";

export function getTemplates() {
    return axios.get('/templates', axiosConfig);
}

export function getTemplateOne(id) {
    return axios.get(`/templates/findOneById/${id}`, axiosConfig);
}

export function getObjectTypesForAddress(id) {
    return axios.get(`/......./${id}`, axiosConfig);
}

export function removeTemplate(id) {
    return axios.delete(`/templates/${id}`, axiosConfig);
}

export function removeSomeTemplates(ids) {
    return axios.post(`/templates/deleteMany`, ids, axiosConfig);
}

export function uploadExcelTemplate(excelTemplateFormData) {
    const formData = new FormData();
    formData.append('excelObjects', event.target.files[0]);

    return axios.post(`/templates/uploadTemplates`, excelTemplateFormData, axiosConfig);
}

export function downloadExcelTemplate() {
    return axios.get(`/templates/downloadExcelTemplates`, axiosConfig);
}
