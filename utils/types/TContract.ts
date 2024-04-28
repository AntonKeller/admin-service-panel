import type TCustomer from "@/utils/types/TCustomer";

export interface TContract {
    _id?: string,
    contractNumber: string,
    contractDate: string,
    customer?: TCustomer,
}

export interface TContractLow {
    contractNumber: string,
    contractDate: string,
    customerId: string,
}