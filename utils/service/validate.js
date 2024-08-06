export const empty_test = v => v?.length > 0 ? true : 'Кол-во символов должно быть > 0';
export const date_test = v => /^\d{2}\.\d{2}\.\d{4}$/i.test(v) ? true : 'Неподходящий формат даты';
