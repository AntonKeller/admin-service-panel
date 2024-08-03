import type TContract from "@/utils/types/TContract";

export default interface TAssignment {
    _id?: string,
    title: string,
    description: string,
    contract?: TContract,
}