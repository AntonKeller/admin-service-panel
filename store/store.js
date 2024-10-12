import {createStore} from "vuex";
import assignments from "./modules/assignments.js";
import inspectionObjects from "./modules/inspectionObjects.js";
import assignmentBlocks from "./modules/assignmentBlocks.js";
import contacts from "./modules/contacts.js";
import customers from "./modules/customers.js";

// Вводный, короткий курс по Vuex
// https://habr.com/ru/articles/421551/

// vuex 4 global-store
export const vuexStore = createStore({
    modules: {
        assignments,
        inspectionObjects,
        assignmentBlocks,
        contacts,
        customers
    },
})