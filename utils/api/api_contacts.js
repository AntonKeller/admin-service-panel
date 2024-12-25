import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchContacts(query) {
    return axios.get('/contacts' + (query ?? ''), axiosConfig);
}

export async function addContact(contact, query) {
    return axios.post('/contacts/add' + (query ?? ''), contact, axiosConfig);
}

export async function changeContact(contact, query) {
    return axios.put('/contacts/update/:id' + contact._id + (query ?? ''), contact, axiosConfig);
}

export async function removeContact(contactID, query) {
    return axios.delete('/contacts/remove/:id' + contactID + (query ?? ''), axiosConfig);
}
