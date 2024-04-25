// Scheme
const Customers = [
    {
        id: '', // Уникальный ключ
        shortName: '',
        fullName: '',
        inn: '',
        phoneNumber: '',
        email: '',
        address: '',
        customerContracts: [
            {
                contractNumber: '', // Уникальный ключ
                assignments: [
                    {
                        assignmentID: '', // Уникальный ключ
                        contractDate: '',
                        assignmentblocks: [
                            {
                                assignmentBlockID: '', // Уникальный ключ
                                plegeAgreement: '',
                                plegerName: '',
                                inspectionobjects: [
                                    {
                                        objectID: '', // Уникальный ключ
                                        inventoryNumber: '',
                                        address: '',
                                        description: '',
                                        // photos: []   - Этого поля больше нет. Все фото хранятся по сумме ключей
                                    }
                                ]
                            }
                        ],
                    }
                ],
            }
        ]
    }
]
