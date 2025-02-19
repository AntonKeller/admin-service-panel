import {fetchAssignments, removeAssignment} from "@/utils/api/api_assignments";

export const initial_page_state = () => ({
    assignments: [],
    selectedAssignment: {},
    fetching: false,
});

const assignments = {
    namespaced: true,
    state: () => initial_page_state(),
    getters: {
        GET_COUNT: (state) => state.assignments.length,
        GET_ASSIGNMENTS: (state) => state.assignments,
        GET_SELECTED_ITEM: (state) => state.selectedAssignment,
        SELECTED: (state) => state.selectedAssignment,
        GET_FETCHING: (state) => state.fetching,
    },
    mutations: {
        RESET_SELECT(state) {
            state.selectedAssignment = initial_page_state().selectedAssignment;
        },
        SET_ASSIGNMENTS(state, payload) {
            state.assignments = payload;
        },
        SELECT(state, payload) {
            state.selectedAssignment = payload || initial_page_state().selectedAssignment;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial_page_state().fetching;
        },
        REMOVE_ITEM(state, id) {
            state.assignments = state.assignments.filter(e => e._id !== id);
        },
        RESET_ASSIGNMENT_LIST(state) {
            state.assignments = initial_page_state().assignments;
        },
    },
    actions: {

        async FETCH({commit}) {

            console.log('fetch assignments execute')

            commit('SET_FETCHING', true);
            let answer = await fetchAssignments();
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ASSIGNMENTS', answer.data);
                    break;
                case 403:
                    commit('alert/ERROR', 'Отказано в доступе' || answer.statusText, {root: true});
                    break;
                default:
                    commit('alert/ERROR', 'Ошибка получения списка заданий' || answer.statusText, {root: true});
                    break;
            }
        },

        async REMOVE_ITEM({commit, getters}, payload) {

            let answer = await removeAssignment(payload);

            switch (answer.status) {
                case 200:
                    commit('REMOVE_ITEM', payload);
                    commit('alert/SUCCESS', 'Успешно удалено' || answer.statusText, {root: true});
                    break;
                case 403:
                    commit('alert/ERROR', 'Отказано в доступе' || answer.statusText, {root: true});
                    break;
                default:
                    commit('alert/ERROR', 'Ошибка запроса' || answer.statusText, {root: true});
                    break;
            }
        }
    },
}

export default assignments;