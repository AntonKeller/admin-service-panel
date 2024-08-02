import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";
import type {TAssignmentBlockKanban} from "@/utils/types/TAssignmentBlock";

const timeDelay = 1500;


export function addNewAssignmentBlock(assignmentBlock: TAssignmentBlock) {
    return axios.post(serverURL + '/assignment-block/add', assignmentBlock, {timeout: timeDelay});
}

export function changeAssignmentBlock(assignmentBlock: TAssignmentBlock) {
    return axios.put(serverURL + '/assignment-block/change', assignmentBlock, {timeout: timeDelay});
}

export function fetchAssignmentBlocks(queryParams: string) {
    return axios.get(serverURL + '/assignment-blocks' + queryParams, {timeout: timeDelay});
}

export async function fetchAssignmentBlocksAll(){
    return await axios.get(serverURL + '/assignment-blocks', {timeout: timeDelay});
}

export async function removeAssignmentBlock(assignmentBlockID: string, delay: number) {
    return await axios.delete(serverURL + '/assignment-block/remove?id=' + assignmentBlockID, {timeout: delay});


}