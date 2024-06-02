import type TCustomer from "@/utils/types/TCustomer";
import type TContract from "@/utils/types/TContract";
import type TExecutor from "@/utils/types/TExecutor";

export default interface TAssignmentBlock {
    _id?: string,
    title: string, // Название задачи
    startDate: string, // Дата начала
    endDate: string, // Дата окончания
    loanAgreement: string, // Номер кредитного договора
    loanAgreementDate: string, // Дата кредитного договора
    plegeAgreement: string, // Номер договора залога
    plegeAgreementDate: string, // Дата договора залога
    status: string, // Статус
}

// Для представления в канбан таблице на отдельной странице
export interface TAssignmentBlockKanban {
    assignmentBlock: TAssignmentBlock,
    customer?: TCustomer,
    contract?: TContract,
    executor?: TExecutor,
}