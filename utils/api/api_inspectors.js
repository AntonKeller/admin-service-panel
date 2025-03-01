import axiosConfig from "@/configs/axios";
import axios from "axios";


export function fetchInspectors(query) {
    return axios.get('/inspectors' + (query ?? ''), axiosConfig);
}

export function fetchInspectorOneById(inspectorID) {
    return axios.get('/inspectors/findOneById/' + (inspectorID ?? ''), axiosConfig);
}

export function addInspector(inspector, query) {
    return axios.post('/inspectors/add' + (query ?? ''), inspector, axiosConfig);
}

export function changeInspector(inspector, query) {
    return axios.put('/inspectors/' + inspector._id + (query ?? ''), inspector, axiosConfig);
}

export function removeInspector(inspectorID, query) {
    return axios.delete('/inspectors/' + inspectorID + (query ?? ''), axiosConfig);
}

export function removeSomeInspectors(ids) {
    return axios.post('/inspectors/deleteMany', ids, axiosConfig);
}
