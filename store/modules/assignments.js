import {fetchAssignments, removeAssignment} from "@/utils/api/api_assignments";

export const initial_page_state = () => ({
    assignments: [],
    selectedAssignment: {},
    fetching: false,
    alert: {},
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
        ALERT: (state) => state.alert,
    },
    mutations: {
        SET_ASSIGNMENTS(state, payload) {
            state.assignments = payload;
        },
        ALERT_SUCCESS(state, payload) {
            state.alert = {type: 'teal-darken-1', msg: payload, isShow: true}
        },
        ALERT_ERROR(state, payload) {
            state.alert = {type: 'red-darken-4', msg: payload, isShow: true}
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
        SHOW_ALERT_SUCCESS(state, payload) {
            state.alert = {type: 'teal-darken-1', msg: payload, isShow: true}
        },
        SHOW_ALERT_ERROR(state, payload) {
            state.alert = {type: 'red-darken-4', msg: payload, isShow: true}
        },
        RESET_STORE(state) {
            state = initial_page_state();
        }
    },
    actions: {

        async FETCH({commit, getters}) {

            console.log('fetch assignments execute')

            commit('SET_FETCHING', true);
            let answer = await fetchAssignments();
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ASSIGNMENTS', answer.data);
                    console.log('assignments:', answer.data);
                    break;
                case 403:
                    commit('SHOW_ALERT_ERROR', 'Отказано в доступе' || answer.statusText);
                    break;
                default:
                    commit('SHOW_ALERT_ERROR', 'Ошибка запроса' || answer.statusText);
                    break;
            }
        },

        async REMOVE_ITEM({commit, getters}, payload) {

            let answer = await removeAssignment(payload, getters.GET_TOKEN);

            switch (answer.status) {
                case 200:
                    commit('REMOVE_ITEM', payload);
                    commit('SHOW_ALERT_SUCCESS', 'Успешно удалено' || answer.statusText);
                    break;
                case 403:
                    commit('SHOW_ALERT_ERROR', 'Отказано в доступе' || answer.statusText);
                    break;
                default:
                    commit('SHOW_ALERT_ERROR', 'Ошибка запроса' || answer.statusText);
                    break;
            }
        }
    },
}

export default assignments;