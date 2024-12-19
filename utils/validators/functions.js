export function isEmpty(value) {
    return (value !== undefined && value !== null && value?.length) || 'Поле не должно быть пустым';
}

export function isDate(value) {
    return (typeof value === 'string' && /^\d{2}\.\d{2}\.\d{4}$/i.test(value)) || 'Неверный формат даты';
}
