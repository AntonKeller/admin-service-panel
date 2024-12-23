import axios from "axios";
import {serverURL} from "@/constants/constants.js";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

export function fetchAngles(objectID, query) {
    return axios.get(serverURL + '/inspection-objects/objectWithAnglesAndPhotos/' + objectID + (query ?? ''), createConfig());
}