import type TCustomer from "@/utils/types/TCustomer";

export default interface TContract {
    id: string,
    contractNumber: string,
    contractDate: string,
    customer?: TCustomer,
}