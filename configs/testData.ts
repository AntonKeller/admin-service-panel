import type TCustomer from '@/utils/types/TCustomer';
import type TContract from "@/utils/types/TContract";
import type TAssignment from "@/utils/types/TAssignment";

export const testDataCustomers: Array<TCustomer> = [
    {
        id: '1',
        shortName: 'ИП ИВАНОВА',
        fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        id: '2',
        shortName: 'ИП ИВАНОВА',
        fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        id: '3',
        shortName: 'ИП ИВАНОВА',
        fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        id: '4',
        shortName: 'ИП ИВАНОВА',
        fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        id: '5',
        shortName: 'ИП ИВАНОВА',
        fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
]


export const testDataContracts: Array<TContract> = [
    {
        id: '1',
        contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
        contractDate: '20.02.2025',
    },
    {
        id: '2',
        contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
        contractDate: '20.02.2025',
    },
    {
        id: '3',
        contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
        contractDate: '20.02.2025',
    },
    {
        id: '4',
        contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
        contractDate: '20.02.2025',
    },
    {
        id: '5',
        contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
        contractDate: '20.02.2025',
    },
]


export const testDataAssignments: Array<TAssignment> = [
    {
        id: '1',
        title: 'Техническое задание',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            id: '1',
            contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
            contractDate: '20.02.2025',
        },
        customer: {
            id: '1',
            shortName: 'ИП ИВАНОВА',
            fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        id: '2',
        title: 'Техническое задание',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            id: '2',
            contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
            contractDate: '20.02.2025',
        },
        customer: {
            id: '2',
            shortName: 'ИП ИВАНОВА',
            fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        id: '3',
        title: 'Техническое задание',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            id: '3',
            contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
            contractDate: '20.02.2025',
        },
        customer: {
            id: '3',
            shortName: 'ИП ИВАНОВА',
            fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        id: '4',
        title: 'Техническое задание',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            id: '4',
            contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
            contractDate: '20.02.2025',
        },
        customer: {
            id: '4',
            shortName: 'ИП ИВАНОВА',
            fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        id: '5',
        title: 'Техническое задание',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            id: '5',
            contractNumber: 'XXXX-XXXX-XXXX-XX-XX',
            contractDate: '20.02.2025',
        },
        customer: {
            id: '5',
            shortName: 'ИП ИВАНОВА',
            fullName: 'ИП ИВАНОВА ОЛЬГА ИГОРЕВНА',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
]
