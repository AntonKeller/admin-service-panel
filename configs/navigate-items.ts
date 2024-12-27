import type TNavItem from '../utils/types/TNavItem';

export const navItems: Array<TNavItem> = [
    {
        _id: 1,
        title: 'Задания',
        route: '/manager-menu/assignments',
        prependIcon: 'mdi-format-list-text',
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
        value: 'customers',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },

];