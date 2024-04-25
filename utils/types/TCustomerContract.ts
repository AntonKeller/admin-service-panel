import TAssignment from "@/utils/types/TAssignment";

export default interface TCustomerContract {
    id: string,
    contractNumber: string,
    assignments?: Array<TAssignment>
}