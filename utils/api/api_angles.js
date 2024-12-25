import axios from "axios";
import axiosConfig from "@/configs/axios";


export function fetchAngles(objectID, query) {
    return axios.get('/inspection-objects/objectWithAnglesAndPhotos/' + objectID + (query ?? ''), axiosConfig);
}