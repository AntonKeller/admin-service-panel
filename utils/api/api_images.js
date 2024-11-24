import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Images
 * */
export async function sendImg(objectId, data, query) {
    return axios.post(serverURL + '/photos/add/' + objectId + (query ?? ''), data, createConfig());
}

export async function removeImg(photoId, query) {
    return axios.delete(serverURL + '/photos/remove/' + photoId + (query ?? ''), createConfig());
}

export async function fetchImages(objectId, query) {
    return axios.get(serverURL + '/photos/all/' + objectId + (query ?? ''), createConfig());
}

export async function downloadImage(url, query) {
    return axios.get(url + (query ?? ''), {
        responseType: "blob",
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    });
}