import {serverURL} from "@/constants/constants";
import axios from "axios";
import type {TAssignment, TAssignmentLow} from "@/utils/types/TAssignment";


export async function addAssignment(assignment: TAssignmentLow, delay: number): Promise<TAssignment> {
    return await axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});
}


export async function changeAssignment(assignment: TAssignment, delay: number): Promise<TAssignment> {
    return await axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
}


export async function fetchAssignments(delay: number): Promise<Array<TAssignment>> {
    return await axios.get(serverURL + '/assignments', {timeout: delay});
}


export async function fetchAssignment(id: number, delay: number): Promise<TAssignment> {
    return await axios.get(serverURL + '/assignments/' + id, {timeout: delay});
}