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
            customer: {
                _id: '1',
                shortName: 'ИП ИВАНОВА',
                fullName: 'Индивидуальный предприниматель Иванова Ольга Игоревна',
                inn: '771573056961',
                phoneNumber: '8-(999)-555-11-22',
                email: 'testEmail@gmail.ru',
                address: 'ул, 1-я Дубровская ул., 1А, Москва, 109044',
            }
        },
    },
    {
        _id: '2',
        title: 'Осмотр магазина',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing. Lorem ipsum dolor sit amet, consectetur adipisicing.',
        contract: {
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
            }
        },
    }
]

export default dataAssignments;