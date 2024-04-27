export default interface TCustomer {
    id: string,
    shortName: string,
    fullName: string,
    inn: string,
    phoneNumber: string,
    email: string,
    address: string,
}

export interface TContract {
    id: string,
    contractNumber: string,
    contractDate: string,
}

export interface TAssignment {
    id: string,
    title: string,
    description: string,
}

export interface TAssignmentEx extends TAssignment {
    contract?: TContract,
    customer?: TCustomer
}

/* ПРИМЕР ДАННЫХ
 export const testDataAssignments: Array<TAssignmentEx> = [
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
 * */