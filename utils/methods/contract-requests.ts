import {serverURL} from "@/constants/constants";
import type {TContract, TContractLow} from "@/utils/types/TContract";
import axios from "axios";


export async function fetchContracts(delay: number): Promise<Array<TContract>> {
    return await axios.get(serverURL + '/contracts', {timeout: delay});
}

export async function addContract(contract: TContractLow, delay: number): Promise<TContract> {
    return axios.post(serverURL + '/contracts/add', contract, {timeout: delay});
}


export function changeContract(contract: TContract, delay: number): Promise<TContract> {
    return axios.put(serverURL + '/contracts/change', contract, {timeout: delay});
}