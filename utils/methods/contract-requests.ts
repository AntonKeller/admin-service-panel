import {serverURL} from "@/constants/constants";
import type TContract from "@/utils/types/TContract";
import axios from "axios";

const delay = 1500;

export async function fetchContracts(): Promise<Array<TContract>> {
    return await axios.get(serverURL + '/contracts', {timeout: delay});
}

export async function fetchContractsWithCustomers(): Promise<Array<TContract>> {
    return await axios.get(serverURL + '/contracts-with-customers', {timeout: delay});
}

export async function addContract(contract: TContract): Promise<TContract> {
    return await axios.post(serverURL + '/contracts/add', contract, {timeout: delay});
}


export async function changeContract(contract: TContract): Promise<TContract> {
    return await axios.put(serverURL + '/contracts/' + contract._id, contract, {timeout: delay});
}


export async function removeContract(id: string): Promise<TContract> {
    return await axios.delete(serverURL + '/contracts/' + id, {timeout: delay});
}