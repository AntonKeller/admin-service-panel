import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

const timeDelay = 1500;


export async function addAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.post(serverURL + '/assignment-block/add', assignmentBlock, {timeout: delay});
}


export async function changeAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.put(serverURL + '/assignment-block/change', assignmentBlock, {timeout: delay});
}


export async function fetchAssignmentBlocks(assignmentID: string) {
    return await axios.get(serverURL + '/assignment-blocks?assignmentID=' + assignmentID, {timeout: timeDelay})
}


export async function removeAssignmentBlock(assignmentBlockID: string, delay: number): Promise<TAssignmentBlock> {
    return await axios.delete(serverURL + '/assignment-block/remove?id=' + assignmentBlockID, {timeout: delay})


}