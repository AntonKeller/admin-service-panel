import type TRegistration from "@/utils/types/TRegistration";
import type TAuthorization from "@/utils/types/TAuthorization";
import {serverURL} from "@/constants/constants";
import axios from "axios";


/**
 * Authentication
 * */
export const registration = (element: TRegistration) => axios.post(serverURL + '/auth/registration', element);

export const authorization = async (element: TAuthorization) => await axios.post(serverURL + '/auth/login', element);

export const accessTest = async (token: String) => await axios.post(serverURL + '/auth/access-test', ({}), {
    timeout: 10000,
    headers: {
        'Access-Token': token,
        'Content-type': '*/*'
    }
});