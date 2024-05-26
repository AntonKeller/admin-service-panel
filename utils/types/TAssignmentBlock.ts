import type TAssignment from "@/utils/types/TAssignment";

export default interface TAssignmentBlock {
    _id?: string,
    loanAgreement: string// Кредитный договор
    loanAgreementDate: string // Дата
    plegeAgreement: string, // Договор залога
    plegeAgreementDate: string, // Дата договора залога
    startDate: string, // Дата начала
    endDate: string, // Дата окончания
    objectCount: string, // Кол-во объектов на осмотр
    status: string, // Статус
    photosCount: string, // Статус
    assignment?: TAssignment,
}