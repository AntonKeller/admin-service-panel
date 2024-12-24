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
 * Pledge Agreements
 * */
export async function fetchPledgeAgreements(query) {
    return axios.get(serverURL + '/pledge-agreements' + (query ?? ''), createConfig());
}

export async function addPledgeAgreement(pledgeAgreement, query) {
    return axios.post(serverURL + '/pledge-agreements/add' + (query ?? ''), pledgeAgreement, createConfig());
}

export async function changePledgeAgreement(pledgeAgreement, query) {
    return axios.put(serverURL + '/pledge-agreements/update/:id' + pledgeAgreement._id + (query ?? ''), pledgeAgreement, createConfig());
}

export async function removePledgeAgreement(pledgeAgreementID, query) {
    return axios.delete(serverURL + '/pledge-agreements/remove/:id' + pledgeAgreementID + (query ?? ''), createConfig());
}
