import axios from "axios";
import {serverURL} from "@/constants/constants";
import type TRegistration from "@/utils/types/TRegistration";
import type TAuthorization from "@/utils/types/TAuthorization";

export const registration = async (element: TRegistration, delay: number) =>
    await axios.post(serverURL + '/registration', element, {timeout: delay || 0});

export const authorization = async (element: TAuthorization, delay: number) =>
    await axios.post(serverURL + '/registration', element, {timeout: delay || 0});
