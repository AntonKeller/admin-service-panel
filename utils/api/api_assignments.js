import axiosConfig from "@/configs/axios";
import axios from "axios";


export function fetchAssignments(query) {
    return axios.get('/assignments' + (query ?? ''), axiosConfig);
}

export function fetchAssignmentOneById(assignmentID, query) {
    return axios.get('/assignments/findOneById/' + (assignmentID ?? '') + (query ?? ''), axiosConfig);
}

export function addNewAssignment(assignment, query) {
    return axios.post('/assignments/add' + (query ?? ''), assignment, axiosConfig);
}

export function changeAssignment(assignment, query) {
    return axios.put('/assignments/' + assignment._id + (query ?? ''), assignment, axiosConfig);
}

export function removeAssignment(id, query) {
    return axios.delete('/assignments/' + id + (query ?? ''), axiosConfig);
}

export function removeAssignments(ids) {
    return axios.post('/assignments/deleteMany', ids, axiosConfig);
}
