import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        timeout: 1500,
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

export async function getProfile(profileID, query) {
    return axios.get(serverURL + '/auth/userByToken' + (query ?? ''), createConfig());
}

export async function changeProfile(profile, query) {
    return axios.post(serverURL + '/' + (query ?? ''), profile, createConfig());
}