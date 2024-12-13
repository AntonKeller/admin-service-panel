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
    return axios.get(serverURL + '/________' + (query ?? ''), createConfig());
}

export async function addLoanAgreement(loanAgreement, query) {
    return axios.post(serverURL + '/_________/add' + (query ?? ''), loanAgreement, createConfig());
}

export async function changeLoanAgreement(loanAgreement, query) {
    return axios.put(serverURL + '/_________/' + loanAgreement._id + (query ?? ''), loanAgreement, createConfig());
}

export async function removeLoanAgreement(loanAgreementID, query) {
    return axios.delete(serverURL + '/_________/' + loanAgreementID + (query ?? ''), createConfig());
}