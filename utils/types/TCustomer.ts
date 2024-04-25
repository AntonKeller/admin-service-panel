import TCustomerContract from "@/utils/types/TCustomerContract";


export default interface TCustomer {
    id: string,
    shortName: string,
    fullName: string,
    inn: string,
    phoneNumber: string,
    email: string,
    address: string,
    contracts?: Array<TCustomerContract>,
}