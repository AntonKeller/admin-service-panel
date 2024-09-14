import _ from "lodash";
import {createStore} from "vuex";
// assignments store
export const assignmentStore = createStore({
    state() {
        return {
            inspectionObjects: {
                items: [],
                page: '',
                itemsLimit: 20,
                totalItems: 0,
                totalPages: 0,
                searchText: '',
            },
            activeInspectionObject: {},
            assignmentBlocks: {
                items: [],
                page: '',
                itemsLimit: 20,
                totalItems: 0,
                totalPages: 0,
                searchText: '',
            },
            activeBlock: {},
            assignments: {
                items: [],
                page: '',
                itemsLimit: 50,
                totalItems: 0,
                totalPages: 0,
                searchText: '',
            },
            selectedAssignment: {},
        };
    },
    mutations: {
        //
        // TODO Доделать mutations и actions для <assignments>
        // ...........
        //
        // TODO Доделать mutations и actions для <assignmentBlocks>
        // ...........
        selectAssignment(state, assignment) {
            state.selectedAssignment = _.cloneDeep(assignment);
        },
        unselectAssignment(state, assignment) {
            state.selectedAssignment = {};
        },
    },
    actions: {
        selectAssignment(context, assignment) {
            // console.log('[action] assignment:', assignment)
            context.commit('selectAssignment', assignment)
        },
    },
    getters: {
        getSelectAssignment: (state) => {
            return state.selectedAssignment;
        }
    }
})