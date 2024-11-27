import type TNavItem from '../utils/types/TNavItem';

export const navItems: Array<TNavItem> = [
    {
        _id: 1,
        title: 'Задания',
        route: '/manager-menu/assignments',
        prependIcon: 'mdi-format-list-text',
        color: 'blue-darken-3',
        value: 'assignments',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 2,
        title: 'Инспекторы',
        route: '/manager-menu/inspectors',
        prependIcon: 'mdi-account-settings-outline',
        color: 'blue-darken-3',
        value: 'inspectors',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 3,
        title: 'Заказчики',
        route: '/manager-menu/customers',
        prependIcon: 'mdi-cards-variant',
        color: 'blue-darken-3',
        value: 'customers',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },

];