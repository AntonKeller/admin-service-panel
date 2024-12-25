import axios from "axios";
import axiosConfig from "@/configs/axios";

export async function getProfile(profileID, query) {
    return axios.get('/auth/userByToken' + (query ?? ''), axiosConfig);
}

export async function changeProfile(profile, query) {
    return axios.post('/' + (query ?? ''), profile, axiosConfig);
}