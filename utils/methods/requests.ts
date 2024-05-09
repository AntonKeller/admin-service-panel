import type TRegistration from "@/utils/types/TRegistration";
import type TAuthorization from "@/utils/types/TAuthorization";
import {serverURL} from "@/constants/constants";
import axios from "axios";


/**
 * Authentication
 * */
export const registration = async (element: TRegistration, delay: number) =>
    await axios.post(serverURL + '/auth/registration', element, {timeout: delay || 0});


export const authorization = async (element: TAuthorization, delay: number) =>
    await axios.post(serverURL + '/auth/login', element, {timeout: delay || 0});