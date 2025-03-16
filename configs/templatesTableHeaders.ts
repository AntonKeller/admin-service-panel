const templatesTableHeaders = [
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
];

export default templatesTableHeaders;