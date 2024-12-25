export const isNotEmptyRule = (value) => {
    return (typeof value === 'string' && value.length > 0) || 'Заполните поле';
}