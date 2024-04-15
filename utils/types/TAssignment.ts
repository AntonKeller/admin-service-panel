import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

export default interface TAssignment {
    id: number,
    number: string,
    signingDate: string,
    customerId: number,
    contractNumber: string,
    contractDate: string,
    blockList?: Array<TAssignmentBlock>
}