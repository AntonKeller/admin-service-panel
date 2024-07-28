import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TAssignment from "@/utils/types/TAssignment";

const delay = 1500;


export async function addNewAssignment(assignment: TAssignment): Promise<TAssignment> {
    return await axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});
}

export async function requestChangeAssignment(assignment: TAssignment): Promise<TAssignment> {
    return await axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
}


export async function fetchAssignments(): Promise<Array<TAssignment>> {
    return await axios.get(serverURL + '/assignments', {timeout: delay});
}


export async function removeAssignment(id: string): Promise<TAssignment> {
    return await axios.delete(serverURL + '/assignments/' + id, {timeout: delay});
}