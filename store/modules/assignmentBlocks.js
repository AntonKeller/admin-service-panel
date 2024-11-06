import {fetchAssignmentBlocks, removeAssignmentBlock} from "@/utils/api/api_assignment_blocks";

export const initial = () => ({
    selectedItem: {},
    items: [],
    fetching: false,
    itemsCount: 0,
    query: {
        page: 1,
        itemsLimit: 20,
    },
    totalItems: 0,
    totalPages: 0,
    searchText: '',
    alert: {},
});

const assignmentBlocks = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_SELECTED_ITEM: (state) => state.selectedItem,
        GET_ITEMS: (state) => state.items,
        GET_ITEMS_COUNT: (state) => state.itemsCount,
        GET_FETCHING: (state) => state.fetching,
        GET_CURRENT_PAGE: (state) => state.query.page,
        GET_ITEMS_LIMIT: (state) => state.query.itemsLimit,
        GET_TOTAL_ITEMS: (state) => state.totalItems,
        GET_TOTAL_PAGES: (state) => state.totalPages,
        GET_SEARCH_TEXT: (state) => state.searchText,
        GET_ALERT: (state) => state.alert,
        GET_QUERY: (state) => {
            return '?' + Object.entries(state.query)
                .filter(([, value]) => !!value)
                .map(([key, value]) => `${key}=${value}`).join('&')
        }
    },
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload || initial().token;
        },
        SET_LIMIT_PAGE_ITEMS(state, payload) {
            state.itemsLimit = payload || initial().itemsLimit;
        },
        SET_CURRENT_PAGE(state, payload) {
            state.page = payload || initial().page;
        },
        SET_SEARCH_TEXT(state, payload) {
            state.searchText = payload || initial().searchText;
        },
        SELECT_ITEM(state, payload) {
            state.selectedItem = payload || initial().selectedItem;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial().fetching;
        },
        SET_ITEMS(state, payload) {
            state.page = payload.page;
            state.totalPages = payload.totalPages;
            state.totalItems = payload.totalItems;
            state.items = payload.data;
            state.itemsCount = payload.data?.length || initial().itemsCount;
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
        async UPDATE_ITEMS({commit, getters}, assignmentID) {

            commit('SET_FETCHING', true);
            let answer = await fetchAssignmentBlocks(assignmentID, getters.GET_QUERY);
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ITEMS', answer.data);
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