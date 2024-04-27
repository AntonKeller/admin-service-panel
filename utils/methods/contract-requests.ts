import {serverURL} from "@/constants/constants";
import type {TContract, TContractEx} from "@/utils/types/TContract";
import axios from "axios";


export async function addContract(contract: TContract, delay: number): Promise<TContract> {
    return axios.post(serverURL + '/contracts/add', contract, {timeout: delay});
}

export async function fetchContracts(delay: number): Promise<Array<TContractEx>> {
    return await axios.get(serverURL + '/contracts', {timeout: delay});
}


// export function changeAssignmentEx(assignment: TAssignmentEx, delay: number): Promise<TAssignmentEx> {
//     return axios.put(serverURL + '/assignments/change', assignment, {timeout: delay});
// }
//
//
// export async function fetchAssignmentsEx(delay: number): Promise<Array<TAssignmentEx>> {
//     return axios.get(serverURL + '/assignments/get', {timeout: delay});
// }
//
//
// export async function fetchAssignmentEx(id: number, delay: number): Promise<TAssignmentEx> {
//     return await axios.get(serverURL + '/assignments/' + id, {timeout: delay});
// }