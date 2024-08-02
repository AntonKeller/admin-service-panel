interface TFile {
    _id: string,
    route: string,
    type: string,
    description: string,
}


export default interface TInspectionObject {
    _id?: string,
    name: string,
    inventoryNumber: string,
    address: string,
    description: string,
    photos?: Array<TFile>
}
