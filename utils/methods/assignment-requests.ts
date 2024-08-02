import type TAssignment from "@/utils/types/TAssignment";
import {serverURL} from "@/constants/constants";
import axios from "axios";

const delay = 1500;

export function fetchAssignments(query: string) {
    return axios.get(serverURL + '/assignments' + query, {timeout: delay});
}

export function addNewAssignment(assignment: TAssignment) {
    return axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});
}

export function changeAssignment(assignment: TAssignment) {
    return axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
}

export function removeAssignment(id: string) {
    return axios.delete(serverURL + '/assignments/' + id, {timeout: delay});
}