import type TInspectionObject from "@/utils/types/TInspectionObject";

export const dataInspectionObjects: Array<TInspectionObject> = [
    {
        _id: '1',
        name: 'Блок генератор',
        inventoryNumber: 'A123456',
        address: 'ул. Верейская, 29',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        photos: [
            {
                _id: '1',
                route: '/first_img.jpeg',
                type: '.jpeg',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            }
        ],
    },
    {
        _id: '2',
        name: 'Блок генератор',
        inventoryNumber: 'A123456',
        address: 'ул. Верейская, 29',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        photos: [
            {
                _id: '1',
                route: '/first_img.jpeg',
                type: '.jpeg',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            },
            {
                _id: '2',
                route: '/first_img.jpeg',
                type: '.jpeg',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            },
            {
                _id: '3',
                route: '/first_img.jpeg',
                type: '.jpeg',
                description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
            }
        ],
    }
]