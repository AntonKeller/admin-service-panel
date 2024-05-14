import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

export async function addAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.post(serverURL + '/assignment-block/add', assignmentBlock, {timeout: delay});
}

export async function changeAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.put(serverURL + '/assignment-block/change', assignmentBlock, {timeout: delay});
}

export async function fetchAssignmentBlocks(assignmentID: string, delay: number): Promise<Array<TAssignmentBlock>> {
    return await axios.get(serverURL + '/assignment-block/getAll?assignmentID=' + assignmentID, {timeout: delay});
}

export async function removeAssignmentBlock(assignmentBlockID: string, delay: number): Promise<TAssignmentBlock> {
    return axios.delete(serverURL + '/assignment-block/remove?id=' + assignmentBlockID, {timeout: delay});
}