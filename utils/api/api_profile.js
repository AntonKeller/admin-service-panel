import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
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