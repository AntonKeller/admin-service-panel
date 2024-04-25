import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

export default interface TAssignment {
    id: string,
    contractDate: string,
    blocks?: Array<TAssignmentBlock>
}