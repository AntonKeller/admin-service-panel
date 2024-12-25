import axios from "axios";
import axiosConfig from "@/configs/axios";


export async function fetchLoanAgreements(query) {
    return axios.get('/loan-agreements' + (query ?? ''), axiosConfig);
}

export async function addLoanAgreement(loanAgreement, query) {
    return axios.post('/loan-agreements/add' + (query ?? ''), loanAgreement, axiosConfig);
}

export async function changeLoanAgreement(loanAgreement, query) {
    return axios.put('/loan-agreements/update/' + loanAgreement._id + (query ?? ''), loanAgreement, axiosConfig);
}

export async function removeLoanAgreement(loanAgreementID, query) {
    return axios.delete('/loan-agreements/remove/' + loanAgreementID + (query ?? ''), axiosConfig);
}