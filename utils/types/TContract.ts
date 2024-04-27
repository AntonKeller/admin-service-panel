import type TCustomer from "@/utils/types/TCustomer";

export interface TContract {
    id: string,
    contractNumber: string,
    contractDate: string,
}

export interface TContractEx extends TContract {
    customer?: TCustomer,
}

