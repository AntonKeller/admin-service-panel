import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

const dataAssignmentBlocks: Array<TAssignmentBlock> = [
    {
        _id: '1',
        title: 'ИП Иванова', // Название задачи
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
    {
        _id: '3',
        title: 'ИП Петрова', // Название задачи
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
    {
        _id: '3',
        title: 'ИП Сидорова', // Название задачи
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
]

export default dataAssignmentBlocks;