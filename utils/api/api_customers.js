import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchCustomers(query) {
    return axios.get('/customers' + (query ?? ''), axiosConfig);
}

export function fetchCustomersAll(query) {
    return axios.get('/customers/all' + (query ?? ''), axiosConfig);
}

export function fetchCustomerOneById(customerID) {
    return axios.get('/customers/findOneById/' + (customerID ?? ''), axiosConfig);
}

export function addCustomer(customer, query) {
    return axios.post('/customers/add' + (query ?? ''), customer, axiosConfig);
}

export function changeCustomer(customer, query) {
    return axios.put('/customers/update/' + (customer._id ?? '') + (query ?? ''), customer, axiosConfig);
}

export function removeCustomer(customerID, query) {
    return axios.delete('/customers/' + (customerID ?? '') + (query ?? ''), axiosConfig);
}

export function removeSomeCustomers(ids) {
    return axios.post('/customers/deleteMany', ids, axiosConfig);
}