import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function sendImg(objectId, data, query) {
    return axios.post('/photos/add/' + objectId + (query ?? ''), data, axiosConfig);
}

export async function removeImg(photoId, query) {
    return axios.delete('/photos/remove/' + photoId + (query ?? ''), axiosConfig);
}

export async function fetchImages(objectId, query) {
    return axios.get('/photos/all/' + objectId + (query ?? ''), axiosConfig);
}