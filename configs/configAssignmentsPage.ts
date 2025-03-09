const configAssignmentsPage = {
    tableHeaders: [
        {
            title: 'Заголовок',
            align: 'start',
            key: 'title',
            value: 'title',
            sortable: true,
            nowrap: false,
            _$visible: true,
        },
        {
            title: 'Заказчик',
            align: 'start',
            key: 'customerShortName',
            value: 'customerShortName',
            sortable: true,
            nowrap: false,
            _$visible: true,
        },
        {
            title: 'Договор с заказчиком',
            align: 'start',
            key: 'assignmentContract',
            value: 'assignmentContract',
            sortable: true,
            nowrap: false,
            _$visible: true,
        },
        {
            title: 'Техническое задание к договору',
            align: 'start',
            key: 'subContract',
            value: 'subContract',
            sortable: true,
            nowrap: false,
            _$visible: true,
        },
        {
            align: 'end',
            key: 'actions',
            sortable: false,
            minWidth: 150,
            maxWidth: 150,
            width: 150,
            nowrap: true,
        },
    ],

    itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
    ],

    itemsPerPage: 10
}

export default configAssignmentsPage;