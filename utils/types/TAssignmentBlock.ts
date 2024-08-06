import type TContract from "@/utils/types/TContract";
import type {TInspector} from "@/utils/types/TInspector";

export default interface TAssignmentBlock {
    _id?: string,
    title: string, // Название задачи
    startDate: string, // Дата начала
    endDate: string, // Дата окончания
    loanAgreement: string, // Номер кредитного договора
    loanAgreementDate: string, // Дата кредитного договора
    pledgeAgreement: string, // Номер договора залога
    pledgeAgreementDate: string, // Дата договора залога
    status: string, // Статус
    inspector?: TInspector,
}

// Для представления в канбан таблице на отдельной странице
export interface TAssignmentBlockKanban {
    assignmentBlock: TAssignmentBlock,
    contract?: TContract,
}