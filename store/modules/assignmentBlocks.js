import {fetchAssignmentBlocks, removeAssignmentBlock} from "@/utils/api/api_assignment_blocks";

export const initial = () => ({
    blocks: [],
    fetching: false,
    selectedBlock: {},
    alert: {},
});

const assignmentBlocks = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_BLOCKS: (state) => state.blocks,
        GET_SELECTED_ITEM: (state) => state.selectedItem,
        GET_FETCHING: (state) => state.fetching,
        GET_ALERT: (state) => state.alert,
    },
    mutations: {
        SET_BLOCKS(state, payload) {
            state.blocks = payload;
        },
        SELECT_ITEM(state, payload) {
            state.selectedItem = payload || initial().selectedItem;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial().fetching;
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
            state = Object.assign(state, initial());
        }
    },
    actions: {
        async FETCH({commit, getters}, assignmentID) {

            commit('SET_FETCHING', true);
            let answer = await fetchAssignmentBlocks(assignmentID);
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_BLOCKS', answer.data.data);
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

            commit('SET_FETCHING', true);
            let answer = await removeAssignmentBlock(payload);
            commit('SET_FETCHING', false);

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
    }
}

export default assignmentBlocks;