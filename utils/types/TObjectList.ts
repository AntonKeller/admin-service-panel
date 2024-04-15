import type TPhoto from "@/utils/types/TPhoto";

export default interface TObjectList {
    name: string,
    photos?: Array<TPhoto>
}