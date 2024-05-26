import type TAssignmentBlock from "@/utils/types/TAssignmentBlock";

const testDataAssignmentBlocks: Array<TAssignmentBlock> = [
    {
        _id: '1',
        loanAgreement: 'XXXXX-XXXXX-XXXXXX-XXXXXX', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '1445-2222-3333-4444-5555', // Договор залога
        plegeAgreementDate: '28.07.23', // Дата договора залога
        startDate: '20.03.24', // Дата начала
        endDate: '20.07.24', // Дата окончания
        objectCount: '500', // Кол-во объектов на осмотр
        status: 'КП', // Статус
        photosCount: '0', // Статус
    },
    {
        _id: '2',
        loanAgreement: 'YYYYYY-YYYYYY-YYYYYY-YYYYYY', // Кредитный договор
        loanAgreementDate: '20.03.24', // Дата
        plegeAgreement: '1445-2222-3333-4444-5555', // Договор залога
        plegeAgreementDate: '14.11.24', // Дата договора залога
        startDate: '1.01.24', // Дата начала
        endDate: '15.01.24', // Дата окончания
        objectCount: '1',
        status: 'Выполняется',
        photosCount: '25',
    },
    {
        _id: '3',
        loanAgreement: 'ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ', // Кредитный договор
        loanAgreementDate: '01.05.23', // Дата
        plegeAgreement: '1445-2222-3333-4444-5555', // Договор залога
        plegeAgreementDate: '10.01.24', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '25',
        status: 'Выполнен',
        photosCount: '50',
    },
    {
        _id: '4',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '5',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '6',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '7',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '8',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '9',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '10',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '11',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
    {
        _id: '12',
        loanAgreement: 'GGHDDZ-GGHDDZ-GGHDDZ-GGHDDZ', // Кредитный договор
        loanAgreementDate: '12.01.23', // Дата
        plegeAgreement: '456546-87575-5545-5656-452', // Договор залога
        plegeAgreementDate: '15.05.23', // Дата договора залога
        startDate: '25.01.24', // Дата начала
        endDate: '25.02.24', // Дата окончания
        objectCount: '100',
        status: 'Выполняется',
        photosCount: '13',
    },
]

export default testDataAssignmentBlocks;