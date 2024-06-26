import type TContract from "@/utils/types/TContract";
import type TCustomer from "@/utils/types/TCustomer";

export default interface TAssignment {
    _id?: string,
    title: string,
    description: string,
    contract?: TContract,
    customer?: TCustomer
}