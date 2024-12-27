import {createStore} from "vuex";
import inspectionObjects from "./modules/inspectionObjects.js";
import assignmentBlocks from "./modules/assignmentBlocks.js";
import alert from "@/store/modules/alert.js";
import assignments from "./modules/assignments.js";
import angles from "@/store/modules/angles.js";
import customers from "@/store/modules/customers.js";

// Вводный, короткий курс по Vuex
// https://habr.com/ru/articles/421551/

// vuex 4 global-store
export const vuexStore = createStore({
    modules: {
        angles,
        alert,
        assignments,
        assignmentBlocks,
        inspectionObjects,
        customers
    },
})