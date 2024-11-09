import {addNewAssignment, fetchAssignments, removeAssignment} from "@/utils/api/api_assignments";

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
        GET_ASSIGNMENTS: (state) => state.assignments,
        GET_SELECTED_ITEM: (state) => state.selectedItem,
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
            state.selectedItem = payload || initial_page_state().selectedItem;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial_page_state().fetching;
        },
        REMOVE_ITEM(state, payload) {
            const index = state.items.findIndex(item => item._id === payload);
            if (index >= 0) state.items.splice(index, 1);
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

            commit('SET_FETCHING', true);
            let answer = await fetchAssignments();
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ASSIGNMENTS', answer.data.data);
                    console.log('[store assignments] answer data:', answer.data);
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