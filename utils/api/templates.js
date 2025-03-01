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

export function uploadExcelTemplate(file) {
    const formData = new FormData();
    formData.append('photoAngles', file);
    return axios.post(`/templates/uploadTemplates`, formData, axiosConfig);
}

export function downloadExcelTemplate() {
    return axios.get(`/templates/downloadExcelTemplates`, axiosConfig);
}

// export function sdfsdf() {
//
//
//     const structure = {
//         _id: '6s6dfgs6dg6sd6g6sd5g5sd5gsd',
//         title: 'Шаблон 1 (базовы)',
//         isBase: true,
//         types: [
//             {
//                 _id: '6sd56gs415dgs65gs65d65gs6d2g62sd32gs3d',
//                 typeName: 'Автомобиль',
//                 angles: [
//                     {
//                         _id: string,
//                         angle: string,
//                         numberOfPhotos: string,
//                         description: string,
//                     }
//                 ]
//             }
//         ],
//     }
//
//
// }