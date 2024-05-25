import type {TContract} from "@/utils/types/TContract";

export interface TAssignment {
    _id?: string,
    title: string,
    description: string,
    contract?: TContract,
}

export interface TAssignmentLow {
    _id?: string,
    title: string,
    description: string,
    contractId: string,
}