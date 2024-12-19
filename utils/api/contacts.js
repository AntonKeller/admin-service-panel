import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Contacts
 * */
export async function fetchContacts(query) {
    return axios.get(serverURL + '/contacts' + (query ?? ''), createConfig());
}

export async function addContact(contact, query) {
    return axios.post(serverURL + '/contact/add' + (query ?? ''), contact, createConfig());
}

export async function changeContact(contact, query) {
    return axios.put(serverURL + '/contact/update/:id' + contact._id + (query ?? ''), contact, createConfig());
}

export async function removeContact(contactID, query) {
    return axios.delete(serverURL + '/contact/remove/:id' + contactID + (query ?? ''), createConfig());
}
