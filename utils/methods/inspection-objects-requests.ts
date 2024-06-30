import {serverURL} from "@/constants/constants";
import axios from "axios";
import type TInspectionObject from "@/utils/types/TInspectionObject";

const delay = 1500;

export async function getInspectionObjects(): Promise<Array<TInspectionObject>> {
    return await axios.get(serverURL + '/inspection-objects', {timeout: delay});
}