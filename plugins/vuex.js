import { createStore } from "vuex";
import {assignmentStore} from '../store/assignments'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(assignmentStore);
    // Install the store instance as a plugin
});