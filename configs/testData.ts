import type TCustomer from '@/utils/types/TCustomer';
import type TContract from "@/utils/types/TContract";

export const testDataCustomers: Array<TCustomer> = [
    {
        _id: '1',
        shortName: 'ИП ИВАНОВА',
        fullName: 'Индивидуальный предприниматель Иванова Ольга Игоревна',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        _id: '2',
        shortName: 'ООО Домстрой',
        fullName: 'Общество с ограниченной ответственностью Домстрой',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        _id: '3',
        shortName: 'ООО Рога и копыта',
        fullName: 'Общество с ограниченной ответственностью Рога и копыта',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        _id: '4',
        shortName: 'ИП Кузнецов Алексей Викторович',
        fullName: 'Индивидуальный предприниматель Кузнецов Алексей Викторович',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
    {
        _id: '5',
        shortName: 'Курочкин Николай Сергеевич',
        fullName: 'Самозанятый Курочкин Николай Сергеевич',
        inn: '771573056961',
        phoneNumber: '8-(999)-555-11-22',
        email: 'testEmail@gmail.ru',
        address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
    },
]


export const testDataContracts: Array<TContract> = [
    {
        _id: '1',
        contractNumber: '1111-1111-1111-11-11',
        contractDate: '20.02.2025',
        customer: {
            _id: '1',
            shortName: 'ИП ИВАНОВА',
            fullName: 'Индивидуальный предприниматель Иванова Ольга Игоревна',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        _id: '2',
        contractNumber: '22222-2222-2222-22-22',
        contractDate: '20.02.2025',
        customer: {
            _id: '2',
            shortName: 'ООО Домстрой',
            fullName: 'Общество с ограниченной ответственностью Домстрой',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        _id: '3',
        contractNumber: '333333-3333-3333-33-33',
        contractDate: '20.02.2025',
        customer: {
            _id: '3',
            shortName: 'ООО Рога и копыта',
            fullName: 'Общество с ограниченной ответственностью Рога и копыта',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        _id: '4',
        contractNumber: '44444-4444-4444-44-44',
        contractDate: '20.02.2025',
        customer: {
            _id: '4',
            shortName: 'ИП Кузнецов Алексей Викторович',
            fullName: 'Индивидуальный предприниматель Кузнецов Алексей Викторович',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
    {
        _id: '5',
        contractNumber: '55555-5555-5555-55-55',
        contractDate: '20.02.2025',
        customer: {
            _id: '5',
            shortName: 'Курочкин Николай Сергеевич',
            fullName: 'Самозанятый Курочкин Николай Сергеевич',
            inn: '771573056961',
            phoneNumber: '8-(999)-555-11-22',
            email: 'testEmail@gmail.ru',
            address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        },
    },
]



