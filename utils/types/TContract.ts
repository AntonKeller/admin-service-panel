import type TCustomer from "@/utils/types/TCustomer";

export default interface TContract {
    _id?: string,
    contractNumber: string,
    contractDate: string,
}

export interface TContractCustomer {
    contract: TContract,
    customer: TCustomer,
}

