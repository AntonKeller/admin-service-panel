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
 * Assignments
 * */
export function fetchAssignments(query) {
    return axios.get(serverURL + '/assignments' + (query ?? ''), createConfig());
}

export function fetchAssignmentOneById(assignmentID, query) {
    return axios.get(serverURL + '/assignments/findOneById/' + (assignmentID ?? '') + (query ?? ''), createConfig());
}

export function addNewAssignment(assignment, query) {
    return axios.post(serverURL + '/assignments/add' + (query ?? ''), assignment, createConfig());
}

export function changeAssignment(assignment, query) {
    return axios.put(serverURL + '/assignments/' + assignment._id + (query ?? ''), assignment, createConfig());
}

export function removeAssignment(id, query) {
    return axios.delete(serverURL + '/assignments/' + id + (query ?? ''), createConfig());
}
