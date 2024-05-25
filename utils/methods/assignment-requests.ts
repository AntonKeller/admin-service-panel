import {serverURL} from "@/constants/constants";
import axios from "axios";
import type {TAssignment, TAssignmentLow} from "@/utils/types/TAssignment";

const delay = 1500;


export async function addAssignment(assignment: TAssignmentLow, delay: number): Promise<TAssignment> {
    return await axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});
}

export async function requestChangeAssignment(assignment: TAssignmentLow): Promise<TAssignment> {
    return await axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
}


export async function fetchAssignments(delay: number): Promise<Array<TAssignment>> {
    return await axios.get(serverURL + '/assignments', {timeout: delay});
}


export async function removeAssignment(id: string, delay: number): Promise<TAssignment> {
    return await axios.delete(serverURL + '/assignments/' + id, {timeout: delay});
}