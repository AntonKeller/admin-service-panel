export function isEmpty(value) {
    return (typeof value === 'string' && value?.length) || 'Поле не должно быть пустым';
}

export function isDate(value) {
    return (typeof value === 'string' && /^\d{2}\.\d{2}\.\d{4}$/i.test(value)) || 'Неверный формат даты';
}

export function isNaN(value) {
    return (typeof value === 'number' && Number.isNaN(value));
}




