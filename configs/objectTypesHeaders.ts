const objectTypesHeaders = [
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
];

export default objectTypesHeaders;