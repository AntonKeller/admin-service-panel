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
        GET_ASSIGNMENTS: (state) => state.assignments,
        GET_SELECTED_ITEM: (state) => state.selectedAssignment,
        SELECTED: (state) => state.selectedAssignment,
    },
    mutations: {
        SET_ASSIGNMENTS(state, payload) {
            state.assignments = payload;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial_page_state().fetching;
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
    },
}

export default assignments;