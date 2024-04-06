import type TNavItem from '@/utils/types/TNavItem';

export const navigateItems: Array<TNavItem> = [
    {
        title: 'Пользователи',
        route: '/manager-menu/users',
        prependIcon: 'mdi-account-group-outline',
        color: 'indigo-accent-4',
        value: 'users',
        active: false,
        badge: {
            show: true,
            color: "info",
            content: "12"
        }
    },
    {
        title: 'Список задач',
        route: '/manager-menu/tasks',
        prependIcon: 'mdi-format-list-text',
        color: 'indigo-accent-4',
        value: 'tasks',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    {
        title: 'Отчеты',
        route: '/manager-menu/reports',
        prependIcon: 'mdi-file-chart-outline',
        color: 'indigo-accent-4',
        value: 'reports',
        active: false,
        badge: {
            show: true,
            color: "error",
            content: "3"
        },
    },
    {
        title: 'Модули',
        route: '/manager-menu/modules',
        prependIcon: 'mdi-view-module',
        color: 'indigo-accent-4',
        value: 'modules',
        active: false,
        badge: {
            show: false,
            color: "error",
            content: "3"
        },
    },
    {
        title: 'Подписка',
        route: '/manager-menu/subscribe',
        prependIcon: 'mdi-card-account-details-star-outline',
        color: 'indigo-accent-4',
        value: 'subscribe',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
];