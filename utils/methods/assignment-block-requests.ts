import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";
import {testDataAssignmentBlocks} from "@/configs/testData";

const timeDelay = 1500;

export async function addAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.post(serverURL + '/assignment-block/add', assignmentBlock, {timeout: delay});
}

export async function changeAssignmentBlock(assignmentBlock: TAssignmentBlock, delay: number): Promise<TAssignmentBlock> {
    return await axios.put(serverURL + '/assignment-block/change', assignmentBlock, {timeout: delay});
}

export const fetchAssignmentBlocks = async (assignmentID: string) =>
    axios.get(serverURL + '/assignment-block/getAll?assignmentID=' + assignmentID, {timeout: timeDelay})
        .then(response => {
            console.log('Блоки задач получены');
            return response?.data;
        })
        .catch(err => {
            console.log('Ошибка получения блоков', err);
            return testDataAssignmentBlocks;
        });

export async function removeAssignmentBlock(assignmentBlockID: string, delay: number): Promise<TAssignmentBlock> {
    return await axios.delete(serverURL + '/assignment-block/remove?id=' + assignmentBlockID, {timeout: delay})


}