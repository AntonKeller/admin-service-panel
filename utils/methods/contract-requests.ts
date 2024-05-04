import {serverURL} from "@/constants/constants";
import type {TContract, TContractLow} from "@/utils/types/TContract";
import axios from "axios";


export async function fetchContracts(delay: number): Promise<Array<TContract>> {
    return await axios.get(serverURL + '/contracts', {timeout: delay});
}


export async function addContract(contract: TContractLow, delay: number): Promise<TContract> {
    return await axios.post(serverURL + '/contracts/add', contract, {timeout: delay});
}


export async function changeContract(id: string, contract: TContract, delay: number): Promise<TContract> {
    return await axios.put(serverURL + '/contracts/' + id, contract, {timeout: delay});
}


export async function removeContract(id: string, delay: number): Promise<TContract> {
    return await axios.delete(serverURL + '/contracts/' + id, {timeout: delay});
}