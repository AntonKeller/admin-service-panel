import type {TAssignmentBlockKanban} from "@/utils/types/TAssignmentBlock";

const dataAssignmentBlocks: Array<TAssignmentBlockKanban> = [
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
        contract: {
            _id: '1',
            contractNumber: 'xxx-xxx-xxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов О.И',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'Выполнено', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В работе', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В работе', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В работе', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1716152400000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В работе', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В ожидании', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
    {
        assignmentBlock: {
            _id: '1',
            title: 'Рога и копыта/xxxx-xxxx-xxxx', // Название задачи
            startDate: '1713560400000', // Дата начала
            endDate: '1720990800000', // Дата окончания
            loanAgreement: 'xxxx-xxxx-xxxx', // Номер кредитного договора
            loanAgreementDate: '1710882000000', // Дата кредитного договора
            plegeAgreement: 'tttt-tttt-tttt', // Номер договора залога
            plegeAgreementDate: '1609448400000', // Дата договора залога
            status: 'В ожидании', // Статус
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
        contract: {
            _id: '1',
            contractNumber: 'xxxx-xxxx-xxxx',
            contractDate: '1739998800000',
        },
        executor: {
            _id: '1',
            fullName: 'Иванов Олег Игоревич',
            phoneNumber: '8-999-888-777-66-44',
            email: 'Ivanov@mail.ru',
        },
    },
]

export default dataAssignmentBlocks;