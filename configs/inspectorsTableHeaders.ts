const headers = [
    {
        align: 'start',
        key: 'name',
        value: 'surname',
        sortable: true,
        title: 'ФИО Инспектора',

    },
    {
        align: 'start',
        key: 'phoneNumber',
        sortable: true,
        title: 'Номер телефона',
    },
    {
        align: 'start',
        key: 'email',
        sortable: true,
        title: 'Email',
    },
    {
        align: 'end',
        key: 'actions',
        sortable: false,
        width: 100,
    },
]

export default headers;