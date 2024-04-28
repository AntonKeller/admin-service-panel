import type TInspectionObject from "@/utils/types/TInspectionObject";

export default interface TAssignmentBlock {
    _id: string,
    plegeAgreement: string, // Номер договора залогодателя
    plegerName: string, // Наименование залогодателя
    inspectionObjects?: Array<TInspectionObject> // Список объектов
}