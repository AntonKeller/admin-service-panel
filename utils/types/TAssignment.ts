import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

export default interface TAssignment {
    id?: string,
    number: string,
    signingDate: string,
    customerId: string,
    contractNumber: string,
    contractDate: string,
    blockList?: Array<TAssignmentBlock>
}