import type TContacts from "@/utils/types/TContacts";
import type TObjectList from "@/utils/types/TObjectList";

export default interface TAssignmentBlock {
    id: number,
    LoanAgreementNumber: string,    // Номер кредитного договора
    pledgorName: string,            // Наименование залогодателя
    pledgeAgreementNumber: string,  // Номер договора залога
    address?: string,               // Адрес (Город, чтобы было общее понимание)
    startDate?: string,             // Дата налача задачи
    endDate?: string,               // Дата окончания задачи
    contacts: TContacts,            // Контактное лицо
    objectList: Array<TObjectList>  // Перечень ОС
}



// - Адрес (Город, чтобы было общее понимание)
// - Дата налача задачи
// - Дата окончания задачи
// - Контактное лицо