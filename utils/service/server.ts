import axios from "axios";
import {serverURL} from "@/constants/constants";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";
import type TCustomer from "@/utils/types/TCustomer";
import type TAssignment from "@/utils/types/TAssignment";
import type TContract from "@/utils/types/TContract";
import type TRegistration from "@/utils/types/TRegistration";
import type TInspectionObject from "@/utils/types/TInspectionObject";


const config = {
    timeout: 1500
};


/**
 * Authentication
 * */
export async function registration(element: TRegistration) {
    return axios.post(serverURL + '/auth/registration', element);
}

export async function accessTest(token: String) {
    return await axios.post(serverURL + '/auth/access-test', ({}), {
        timeout: 3000,
        headers: {
            'Authorization': token,
            'Content-type': '*/*'
        }
    });
}


/**
 * Inspectors
 * */
export async function fetchInspectorsAll() {
    return axios.get(serverURL + '/inspectors', config);
}


/**
 * Inspection objects
 * */
export async function fetchInspectionObjects(query: string) {
    return axios.get(serverURL + '/inspection-objects' + (query || ''), config);
}

export async function sendInspectionObject(blockId: string, data: TInspectionObject) {
    return axios.post(serverURL + '/inspection-objects/add/' + blockId, data, config);
}

export async function changeInspectionObject(_object: TInspectionObject) {
    return axios.put(serverURL + '/inspection-objects/' + _object._id, _object, config);
}


/**
 * Images
 * */
export async function sendImg(object_id: string, data: any) {
    return axios.post(serverURL + '/photos/add/' + object_id, data, config);
}

export async function removeImg(photoId: string) {
    return axios.delete(serverURL + '/photos/remove/' + photoId, config);
}

export async function fetchImages(object_id: string) {
    return axios.get(serverURL + '/photos/all/' + object_id, config);
}



/**
 * Customers
 * */
export async function fetchCustomers() {
    return axios.get(serverURL + '/customers', config);
}

export async function fetchCustomersAll() {
    return axios.get(serverURL + '/customers/all', config);
}

export async function fetchCustomer(id: string) {
    return axios.get(serverURL + '/customers/' + id, config);
}

export async function addCustomer(customer: TCustomer) {
    return axios.post(serverURL + '/customers/add', customer, config);
}

export async function putCustomer(customer: TCustomer) {
    return axios.put(serverURL + '/customers/change', customer, config);
}

export async function removeCustomer(id: string) {
    return axios.delete(serverURL + '/customers/' + id, config);
}


/**
 * Contract
 * */
export async function fetchContracts() {
    return axios.get(serverURL + '/contracts', config);
}

export async function fetchContractsAll() {
    return axios.get(serverURL + '/contracts/all', config);
}

export async function fetchContractsWithCustomers() {
    return axios.get(serverURL + '/contracts-with-customers', config);
}

export async function addContract(contract: TContract) {
    return axios.post(serverURL + '/contracts/add', contract, config);
}

export async function changeContract(contract: TContract) {
    return axios.put(serverURL + '/contracts/' + contract._id, contract, config);
}

export async function removeContract(id: string) {
    return axios.delete(serverURL + '/contracts/' + id, config);
}


/**
 * Assignments
 * */
export function fetchAssignments(query: string) {
    return axios.get(serverURL + '/assignments' + query, config);
}

export function addNewAssignment(assignment: TAssignment) {
    return axios.post(serverURL + '/assignments/add', assignment, config);
}

export function changeAssignment(assignment: TAssignment) {
    return axios.put(serverURL + '/assignments/' + assignment._id, assignment, config);
}

export function removeAssignment(id: string) {
    return axios.delete(serverURL + '/assignments/' + id, config);
}


/**
 * Assignment Blocks
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

export function changeAssignmentBlock(assignmentId: string, block: TAssignmentBlock) {
    return axios.put(serverURL + '/assignment-blocks/' + assignmentId + '/change/' + block._id, block, config);
}

export function removeAssignmentBlock(blockId: string) {
    return axios.delete(`${serverURL}/assignment-blocks/remove?id=${blockId}`, config);
}

