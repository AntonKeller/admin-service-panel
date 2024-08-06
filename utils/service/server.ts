import axios from "axios";
import {serverURL} from "@/constants/constants.js";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock.ts";


const config = {
    timeout: 1500
};

/**
 * Inspectors
 * */
export function fetchInspectorsAll() {
    return axios.get(serverURL + '/inspectors', config);
}


/**
 * Inspection objects
 * */
export function fetchInspectionObjects(query: string) {
    return axios.get(serverURL + '/inspection-objects' + query, config);
}


/**
 * Images
 * */
async function get_images(object_id: string) {
    return axios.get(`${serverURL}/photos/archive/${object_id}`);
}

async function get_image(photo_id: string) {
    return axios.get(`${serverURL}/inspection-objects/images/add/${photo_id}`);
}

async function send_image(object_id: string) {
    return axios.get(`${serverURL}/photos/add/${object_id}`);
}

async function remove_images(object_id: string) {
    return axios.get(`${serverURL}/photos/${object_id}/deleteAll`);
}


/**
 * assignment blocks
 * */
export function fetchAssignmentBlocks(query: string) {
    return axios.get(serverURL + '/assignment-blocks' + query, config);
}

export function fetchAssignmentBlocksKanban(query: string) {
    return axios.get(`${serverURL}/assignment-blocks/kanban${query}`, config);
}

export function sendAssignmentBlock(assignmentId: string, block: TAssignmentBlock) {
    return axios.post(serverURL + '/assignment-blocks/add/' + assignmentId, block, config);
}

export function changeAssignmentBlock(block: TAssignmentBlock) {
    return axios.put(serverURL + '/assignment-block/change', block, config);
}

export function removeAssignmentBlock(blockId: string) {
    return axios.delete(`${serverURL}/assignment-block/remove?id=${blockId}`, config);
}

