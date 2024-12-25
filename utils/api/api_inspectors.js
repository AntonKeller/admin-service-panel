import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchInspectors(query) {
    return axios.get('/inspectors' + (query ?? ''), axiosConfig);
}

export async function addInspector(inspector, query) {
    return axios.post('/inspectors/add' + (query ?? ''), inspector, axiosConfig);
}

export async function changeInspector(inspector, query) {
    return axios.put('/inspectors/' + inspector._id + (query ?? ''), inspector, axiosConfig);
}

export async function removeInspector(inspectorID, query) {
    return axios.delete('/inspectors/' + inspectorID + (query ?? ''), axiosConfig);
}