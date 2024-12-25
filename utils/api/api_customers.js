import axios from "axios";
import axiosConfig from "@/configs/axios.js";


export function fetchCustomers(query) {
    return axios.get('/customers' + (query ?? ''), axiosConfig);
}

export function fetchCustomersAll(query) {
    return axios.get('/customers/all' + (query ?? ''), axiosConfig);
}

export function addCustomer(customer, query) {
    return axios.post('/customers/add' + (query ?? ''), customer, axiosConfig);
}

export function changeCustomer(customer, query) {
    return axios.put('/customers/change' + (query ?? ''), customer, axiosConfig);
}

export function removeCustomer(customerID, query) {
    return axios.delete('/customers/' + (customerID ?? '') + (query ?? ''), axiosConfig);
}

export function uploadTemplate(customerID, file, query) {
    return axios.post('/customers/uploadTemplates/' + (customerID ?? '') + (query ?? ''), file, axiosConfig);
}