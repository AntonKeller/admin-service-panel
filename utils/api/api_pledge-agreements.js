import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchPledgeAgreements(query) {
    return axios.get('/pledge-agreements' + (query ?? ''), axiosConfig);
}

export async function addPledgeAgreement(pledgeAgreement, query) {
    return axios.post('/pledge-agreements/add' + (query ?? ''), pledgeAgreement, axiosConfig);
}

export async function changePledgeAgreement(pledgeAgreement, query) {
    return axios.put('/pledge-agreements/update/' + pledgeAgreement._id + (query ?? ''), pledgeAgreement, axiosConfig);
}

export async function removePledgeAgreement(pledgeAgreementID, query) {
    return axios.delete('/pledge-agreements/remove/' + pledgeAgreementID + (query ?? ''), axiosConfig);
}
