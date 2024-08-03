import type {TAssignmentBlockKanban} from "@/utils/types/TAssignmentBlock";

export const dataAssignmentBlocksKanban: Array<TAssignmentBlockKanban> = [
    {
        assignmentBlock: {
            _id: '1',
            title: 'ИП ИВАНОВА', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'Выполнено', // Статус
            executor: {
                _id: '1',
                fullName: 'Иванов О.И',
                phoneNumber: '8-999-888-777-66-44',
                email: 'Ivanov@mail.ru',
            },
        },
        contract: {
            _id: '1',
            contractNumber: 'xxx-xxx-xxx',
            contractDate: '1739998800000',
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
    }
]