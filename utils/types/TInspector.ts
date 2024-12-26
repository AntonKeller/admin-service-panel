export interface TInspector {
    _id: string,
    firstName: string,
    surname: string,
    lastName: string,
    email: string,
    phoneNumber: string,
}

export interface TInspectorOutput extends TInspector {
    login: string,
    password: string,
}