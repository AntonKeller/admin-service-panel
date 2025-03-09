const configTemplatesPage = {
    templatesHeaders: [
        {
            title: 'Наименование шаблона',
            align: 'start',
            key: 'title',
            value: 'title',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            title: 'Загружено типов объектов',
            align: 'start',
            key: 'objectTypesLen',
            value: 'objectTypesLen',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            title: 'Базовый шаблон',
            align: 'start',
            key: 'isBase',
            value: 'isBase',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            align: 'end',
            key: 'actions',
            sortable: false,
            minWidth: 150,
            maxWidth: 150,
            width: 150,
            nowrap: true,
            _$visible: true
        },
    ],

    objectTypesHeaders: [
        {
            title: 'Тип объекта',
            align: 'start',
            key: 'type',
            value: 'type',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            title: 'Кол-во ракурсов',
            align: 'start',
            key: 'anglesCount',
            value: 'anglesCount',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            align: 'end',
            key: 'actions',
            sortable: false,
            minWidth: 150,
            maxWidth: 150,
            width: 150,
            nowrap: true,
            _$visible: true
        },
    ],

    anglesHeaders: [
        {
            title: 'Ракурс',
            align: 'start',
            key: 'angle',
            value: 'angle',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            title: 'Описание',
            align: 'start',
            key: 'description',
            value: 'description',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            title: 'Кол-во фото',
            align: 'start',
            key: 'numberOfPhotos',
            value: 'numberOfPhotos',
            sortable: true,
            nowrap: false,
            _$visible: true
        },
        {
            align: 'end',
            key: 'actions',
            sortable: false,
            minWidth: 150,
            maxWidth: 150,
            width: 150,
            nowrap: true,
            _$visible: true
        },
    ],

    itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
    ],

    itemsPerPage: 10,
}

export default configTemplatesPage;
