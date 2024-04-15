import axios from "axios";
import {serverURL} from "@/constants/constants";
import type TAssignment from "@/utils/types/TAssignment";


export const addAssignment = async (assignment: TAssignment) =>
    await axios.post(serverURL + '/assignments/add', assignment);

export const fetchAssignment = async (id: number, delay: number) =>
    await axios.get(serverURL + '/assignments/' + id, {timeout: delay});

export const fetchAssignments = async (delay: number) =>
    await axios.get(serverURL + '/assignments', {timeout: delay});

export const putAssignment = async (assignment: TAssignment, id: number, delay: number) =>
    await axios.put(serverURL + '/assignments/' + id, assignment, {timeout: delay});
