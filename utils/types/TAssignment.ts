import type {TContract} from "@/utils/types/TContract";
import type TCustomer from "@/utils/types/TCustomer";

export interface TAssignment {
    id: string,
    title: string,
    description: string,
}

export interface TAssignmentEx extends TAssignment {
    contract?: TContract,
    customer?: TCustomer
}