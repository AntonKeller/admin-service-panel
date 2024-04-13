import axios from "axios";
import {serverURL} from "@/constants/constants";
import type TCustomer from '@/utils/types/TCustomer'


export const addCustomer = async (customer: TCustomer) =>
    await axios.post(serverURL + '/customers/add', customer);

export const fetchCustomer = async (id: number, t: number) =>
    await axios.get(serverURL + '/customers/' + id, {timeout: t});

export const fetchCustomers = async (t: number) =>
    await axios.get(serverURL + '/customers', {timeout: t});
