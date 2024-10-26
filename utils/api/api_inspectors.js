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

/**
 * Inspectors
 * */
export async function fetchInspectorsAll(query) {
    return axios.get(serverURL + '/inspectors' + (query ?? ''), createConfig());
}
