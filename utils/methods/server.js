import axios from "axios";
import {serverURL} from "@/constants/constants.js";


async function get_images(object_id) {
    return axios.get(`${serverURL}/photos/archive/${object_id}`);
}

async function get_image(photo_id) {
    return axios.get(`${serverURL}/inspection-objects/images/add/${photo_id}`);
}

async function send_image(object_id) {
    return axios.get(`${serverURL}/photos/add/${object_id}`);
}

async function remove_image() {
    return axios.get(`${serverURL}/photos/${object_id}/deleteAll`);
}
