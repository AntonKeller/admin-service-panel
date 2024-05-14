import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

export default interface TInspectionObject {
    _id?: string,
    assignmentBlock?: TAssignmentBlock,
    inventoryNumber: string,
    address: string,
    description: string,
}