export const isNotEmptyRule = (value) => {
    return (typeof value === 'string' && value.length > 0) || 'Заполните поле';
}

export const isINN = (value) => {
    return !value || typeof value === "string" && /^(([0-9]{12})|([0-9]{10}))?$/.test(value) || 'Некорректный ИНН';
}