import {serverURL} from "@/constants/constants";
import axios from "axios";
import type {TAssignmentEx} from "@/utils/types/TAssignment";


export async function addAssignmentEx(assignment: TAssignmentEx, delay: number): Promise<TAssignmentEx> {
    return axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});
}

export function changeAssignmentEx(assignment: TAssignmentEx, delay: number): Promise<TAssignmentEx> {
    return axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
}


export async function fetchAssignmentsEx(delay: number): Promise<Array<TAssignmentEx>> {
    return axios.get(serverURL + '/assignments/get', {timeout: delay});
}


export async function fetchAssignmentEx(id: number, delay: number): Promise<TAssignmentEx> {
    return await axios.get(serverURL + '/assignments/' + id, {timeout: delay});
}