interface TFile {
    _id: string,
    route: string,
    type: string,
}


export default interface TInspectionObject {
    _id?: string,
    name: string,
    inventoryNumber: string,
    address: string,
    description: string,
}
