import type TNavItem from '../utils/types/TNavItem';

export const navItems: Array<TNavItem> = [
    {
        _id: 1,
        title: 'Задания',
        route: '/manager-menu/assignments',
        prependIcon: 'mdi-calendar-check-outline',
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
        prependIcon: 'mdi-account-group-outline',
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
        prependIcon: 'mdi-card-account-details-outline',
        value: 'customers',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },

];