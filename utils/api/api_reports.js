import axios from "axios";
import {serverURL} from "@/constants/constants.js";

function createConfig() {
    return {
        timeout: 1500,
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Reports api
 * */
export function fetchReports(query) {
    return axios.get(serverURL + '/reports' + (query ?? ''), createConfig());
}