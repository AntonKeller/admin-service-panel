import type TNavItem from '../utils/types/TNavItem';

export const navigateItems: Array<TNavItem> = [
    // {
    //     title: 'Инспекторы',
    //     route: '/manager-menu/inspectors',
    //     prependIcon: 'mdi-account-hard-hat-outline',
    //     color: 'indigo-accent-4',
    //     value: 'inspectors',
    //     active: false,
    //     badge: {
    //         show: true,
    //         color: "info",
    //         content: "12"
    //     }
    // },
    {
        title: 'Задания',
        route: '/manager-menu/assignments',
        prependIcon: 'mdi-format-list-text',
        color: 'indigo-accent-4',
        value: 'assignments',
        active: false,
        badge: {
            show: false,
            color: "info",
            content: "12"
        },
    },
    // {
    //     title: 'Организации',
    //     route: '/manager-menu/customers',
    //     prependIcon: 'mdi-home-city-outline',
    //     color: 'indigo-accent-4',
    //     value: 'customers',
    //     active: false,
    //     badge: {
    //         show: true,
    //         color: "error",
    //         content: "3"
    //     },
    // },
    // {
    //     title: 'Договоры',
    //     route: '/manager-menu/agreement',
    //     prependIcon: 'mdi-file-document-multiple-outline',
    //     color: 'indigo-accent-4',
    //     value: 'agreement',
    //     active: false,
    //     badge: {
    //         show: true,
    //         color: "info",
    //         content: "2"
    //     },
    // },
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