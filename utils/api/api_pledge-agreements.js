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
    return axios.get(serverURL + '/pledge-agreement' + (query ?? ''), createConfig());
}

export async function addPledgeAgreement(pledgeAgreement, query) {
    return axios.post(serverURL + '/pledge-agreement/add' + (query ?? ''), pledgeAgreement, createConfig());
}

export async function changePledgeAgreement(pledgeAgreement, query) {
    return axios.put(serverURL + '/pledge-agreement/update/:id' + pledgeAgreement._id + (query ?? ''), pledgeAgreement, createConfig());
}

export async function removePledgeAgreement(pledgeAgreementID, query) {
    return axios.delete(serverURL + '/pledge-agreement/remove/:id' + pledgeAgreementID + (query ?? ''), createConfig());
}
