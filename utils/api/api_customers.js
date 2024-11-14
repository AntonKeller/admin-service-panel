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
 * Customers
 * */
export async function fetchCustomers(query) {
    return axios.get(serverURL + '/customers' + (query ?? ''), createConfig());
}

export async function fetchCustomersAll(query) {
    return axios.get(serverURL + '/customers/all' + (query ?? ''), createConfig());
}

export async function addCustomer(customer, query) {
    return axios.post(serverURL + '/customers/add' + (query ?? ''), customer, createConfig());
}

export async function changeCustomer(customer, query) {
    return axios.put(serverURL + '/customers/change' + (query ?? ''), customer, createConfig());
}

export async function removeCustomer(customerID, query) {
    return axios.delete(serverURL + '/customers/' + (customerID ?? '') + (query ?? ''), createConfig());
}

export async function uploadTemplate(customerID, file, query) {
    return axios.post(serverURL + '/customers/uploadTemplates/' + (customerID ?? '') + (query ?? ''), file, createConfig());
}