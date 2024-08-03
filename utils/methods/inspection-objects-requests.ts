import {serverURL} from "@/constants/constants";
import axios from "axios";

const delay = 1500;

export function fetchInspectionObjects(query: string) {
    return axios.get(serverURL + '/inspection-objects' + query, {timeout: delay});
}