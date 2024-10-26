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
        title: 'Отчеты',
        route: '/manager-menu/reports',
        prependIcon: 'mdi-file-document-arrow-right-outline',
        color: 'blue-darken-3',
        value: 'reports',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        _id: 3,
        title: 'Осмотрщики',
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
];