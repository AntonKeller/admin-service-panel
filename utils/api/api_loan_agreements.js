import axios from "axios";
import {serverURL} from "@/constants/constants";

function createConfig() {
    return {
        headers: {
            authorization: localStorage.accessToken ?? '',
        }
    }
}

/**
 * Loan Agreements
 * */
export async function fetchLoanAgreements(query) {
    return axios.get(serverURL + '/loan-agreements' + (query ?? ''), createConfig());
}

export async function addLoanAgreement(loanAgreement, query) {
    return axios.post(serverURL + '/loan-agreements/add' + (query ?? ''), loanAgreement, createConfig());
}

export async function changeLoanAgreement(loanAgreement, query) {
    return axios.put(serverURL + '/loan-agreements/update/' + loanAgreement._id + (query ?? ''), loanAgreement, createConfig());
}

export async function removeLoanAgreement(loanAgreementID, query) {
    return axios.delete(serverURL + '/loan-agreements/remove/' + loanAgreementID + (query ?? ''), createConfig());
}