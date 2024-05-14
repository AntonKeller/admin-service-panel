import type TInspectionObject from "@/utils/types/TInspectionObject";

export default interface TPhoto {
    _id: string,
    inspectionObject?: TInspectionObject,
    description: string,
    buffer: string,
}