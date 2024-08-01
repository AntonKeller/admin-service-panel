import type TNavItem from '../utils/types/TNavItem';

export const navItems: Array<TNavItem> = [
    {
        _id: 1,
        title: 'Задания',
        route: '/manager-menu/assignments',
        prependIcon: 'mdi-format-list-text',
        color: 'teal-darken-3',
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
        title: 'Блоки задач',
        route: '/manager-menu/assignment-blocks',
        prependIcon: 'mdi-calendar-check',
        color: 'teal-darken-3',
        value: 'assignment-blocks',
        active: false,
        badge: {
            show: false,
            color: "error",
            content: "3"
        },
    },
    {
        _id: 3,
        title: 'Модули',
        route: '/manager-menu/modules',
        prependIcon: 'mdi-view-module',
        color: 'teal-darken-3',
        value: 'modules',
        active: false,
        badge: {
            show: false,
            color: "error",
            content: "3"
        },
    },
    {
        _id: 4,
        title: 'Подписка',
        route: '/manager-menu/subscribe',
        prependIcon: 'mdi-card-account-details-star-outline',
        color: 'teal-darken-3',
        value: 'subscribe',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
];