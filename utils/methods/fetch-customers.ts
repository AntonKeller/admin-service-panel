import axios from "axios";
import {serverURL} from "@/constants/constants";
import type TCustomer from '@/utils/types/TCustomer'


export const addCustomer = async (customer: TCustomer, delay: number) =>
    await axios.post(serverURL + '/customers/add', customer, {timeout: delay});

export const fetchCustomer = async (id: number, delay: number) =>
    await axios.get(serverURL + '/customers/' + id, {timeout: delay});

export const fetchCustomers = async (delay: number) =>
    await axios.get(serverURL + '/customers', {timeout: delay});

export const putCustomer = async (customer: TCustomer, id: number, delay: number) =>
    await axios.put(serverURL + '/customers/' + id, customer, {timeout: delay});
