import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TCustomer from "@/utils/types/TCustomer";

const delay = 1500;

export const addCustomer = async (customer: TCustomer) =>
    await axios.post(serverURL + '/customers/add', customer, {timeout: delay});


export const fetchCustomer = async (id: string) =>
    await axios.get(serverURL + '/customers/' + id, {timeout: delay});


export const fetchCustomers = async () =>
    await axios.get(serverURL + '/customers', {timeout: delay});


export const putCustomer = async (customer: TCustomer) =>
    await axios.put(serverURL + '/customers/change', customer, {timeout: delay});

export const removeCustomer = async (id: string) =>
    await axios.delete(serverURL + '/customers/' + id, {timeout: delay});