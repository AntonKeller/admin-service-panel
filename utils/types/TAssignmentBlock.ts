import type {TAssignment} from "@/utils/types/TAssignment";

export default interface TAssignmentBlock {
    _id?: string,
    plegeAgreement: string, // Номер договора залогодателя
    plegerName: string, // Наименование залогодателя
    objectCount: string,
    status: string,
    photosCount: string,
    assignment?: TAssignment,
}