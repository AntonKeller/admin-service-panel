import type TAssignment from "@/utils/types/TAssignment";
import type TRegistration from "@/utils/types/TRegistration";
import type TAuthorization from "@/utils/types/TAuthorization";
import type TCustomer from "@/utils/types/TCustomer";
import {serverURL} from "@/constants/constants";
import axios from "axios";


/**
 * Authentication
 * */
export const registration = async (element: TRegistration, delay: number) =>
    await axios.post(serverURL + '/registration', element, {timeout: delay || 0});

export const authorization = async (element: TAuthorization, delay: number) =>
    await axios.post(serverURL + '/registration', element, {timeout: delay || 0});


/**
 * Customers
 * */
export const addCustomer = async (customer: TCustomer, delay: number) =>
    await axios.post(serverURL + '/customers/add', customer, {timeout: delay || 0});

export const fetchCustomer = async (id: number, delay: number) =>
    await axios.get(serverURL + '/customers/' + id, {timeout: delay || 0});

export const fetchCustomers = async (delay: number) =>
    await axios.get(serverURL + '/customers', {timeout: delay || 0});

export const putCustomer = async (customer: TCustomer, delay: number) =>
    await axios.put(serverURL + '/customers/change', customer, {timeout: delay || 0});


/**
 * Customer Contracts
 * */


/**
 * Assignments
 * */
export const addAssignment = async (assignment: TAssignment, delay: number) =>
    await axios.post(serverURL + '/assignments/add', assignment, {timeout: delay});

export const fetchAssignment = async (id: number, delay: number) =>
    await axios.get(serverURL + '/assignments/' + id, {timeout: delay});

export const fetchAssignments = async (delay: number) =>
    await axios.get(serverURL + '/assignments', {timeout: delay});

export const putAssignment = async (assignment: TAssignment, delay: number) =>
    await axios.put(serverURL + '/assignments/', assignment, {timeout: delay});



















