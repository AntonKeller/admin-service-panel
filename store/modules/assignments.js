import {addNewAssignment, fetchAssignments, removeAssignment} from "@/utils/api/api_assignments";

export const initial_page_state = () => ({
    token: '',
    selectedItem: {},
    items: [],
    fetching: false,
    itemsCount: 0,
    page: '',
    itemsLimit: 20,
    totalItems: 0,
    totalPages: 1,
    searchText: '',
    queryParams: '',
    alert: {},
});

const assignments = {
    namespaced: true,
    state: () => initial_page_state(),
    getters: {
        GET_TOKEN: (state) => state.token,
        GET_SELECTED_ITEM: (state) => state.selectedItem,
        GET_ITEMS: (state) => state.items,
        GET_ITEMS_COUNT: (state) => state.itemsCount,
        GET_FETCHING: (state) => state.fetching,
        GET_CURRENT_PAGE: (state) => state.page,
        GET_ITEMS_LIMIT: (state) => state.itemsLimit,
        GET_TOTAL_ITEMS: (state) => state.totalItems,
        GET_TOTAL_PAGES: (state) => state.totalPages,
        GET_SEARCH_TEXT: (state) => state.searchText,
        GET_QUERY_PARAMS: (state) => state.queryParams,
        GET_ALERT: (state) => state.alert,
        GET_QUERY: (state) => {
            const buff = [
                state.page && state.page > 0 ? `page=${state.page}` : null,
                state.itemsLimit && state.itemsLimit > 0 ? `limit=${state.itemsLimit}` : null,
                state.searchText && state.searchText.length > 0 ? `searchText=${state.searchText}` : null
            ].filter(e => !!e).join('&');
            return buff && buff?.length > 0 ? `?${buff}` : '';
        }
    },
    mutations: {
        SET_TOKEN(state, payload) {
            state.token = payload || initial_page_state().token;
        },
        SET_LIMIT_PAGE_ITEMS(state, payload) {
            state.itemsLimit = payload || initial_page_state().itemsLimit;
        },
        SET_CURRENT_PAGE(state, payload) {
            state.page = payload || initial_page_state().page;
        },
        SET_SEARCH_TEXT(state, payload) {
            state.searchText = payload || initial_page_state().searchText;
        },
        SELECT_ITEM(state, payload) {
            state.selectedItem = payload || initial_page_state().selectedItem;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial_page_state().fetching;
        },
        SET_ITEMS(state, payload) {
            state.page = payload.currentPage;
            state.totalPages = payload.totalPages;
            state.totalItems = payload.totalItems;
            state.items = payload.data;
            state.itemsCount = payload.data?.length || initial_page_state().itemsCount;
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

        async UPDATE_ITEMS({commit, getters}) {

            commit('SET_FETCHING', true);
            let answer = await fetchAssignments(getters.GET_QUERY);
            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ITEMS', answer.data);
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

        async ADD_NEW_ITEM({commit, getters}, payload) {

            let answer = await addNewAssignment(payload, getters.GET_TOKEN);

            switch (answer.status) {
                case 200:
                    commit('ADD_ITEM', payload);
                    commit('SHOW_ALERT_SUCCESS', 'Успешно добавлено' || answer.statusText);
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