import type TAssignment from "@/utils/types/TAssignment";

const dataAssignments: Array<TAssignment> = [
    {
        _id: '1',
        title: 'Осмотр гаражей',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            _id: '1',
            contractNumber: '1111-1111-1111-11-11',
            contractDate: '20.02.2025',
        },
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
        title: 'Осмотр кораблей',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            _id: '2',
            contractNumber: '22222-2222-2222-22-22',
            contractDate: '20.02.2025',
        },
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
        title: 'Помещения',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            _id: '3',
            contractNumber: '333333-3333-3333-33-33',
            contractDate: '20.02.2025',
        },
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
        title: 'Основные средства',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            _id: '4',
            contractNumber: '44444-4444-4444-44-44',
            contractDate: '20.02.2025',
        },
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
        title: 'Осмотр бань',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
            _id: '5',
            contractNumber: '55555-5555-5555-55-55',
            contractDate: '20.02.2025',
        },
        // customer: {
        //     _id: '5',
        //     shortName: 'Курочкин Н.C',
        //     fullName: 'Самозанятый Курочкин Николай Сергеевич',
        //     inn: '771573056961',
        //     phoneNumber: '8-(999)-555-11-22',
        //     email: 'testEmail@gmail.ru',
        //     address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
        // },
    },
];

export default dataAssignments;