import {fetchAssignmentBlocks} from "@/utils/api/api_assignment_blocks";

export const initial = () => ({
    blocks: [],
    fetching: false,
    selectedBlock: {},
});

const assignmentBlocks = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_BLOCKS: (state) => state.blocks,
        SELECTED: (state) => state.selectedBlock,
        GET_SELECTED_ITEM: (state) => state.selectedBlock,
        GET_FETCHING: (state) => state.fetching,
    },
    mutations: {
        SET_BLOCKS(state, payload) {
            state.blocks = payload;
        },
        RESET_BLOCK_LIST(state) {
            state.blocks = initial().blocks;
        },
        SELECT(state, payload) {
            state.selectedBlock = payload || initial().selectedBlock;
        },
        RESET_SELECTED(state) {
            state.selectedBlock = initial().selectedBlock;
        },
        SET_FETCHING(state, payload) {
            state.fetching = payload || initial().fetching;
        },
        REMOVE_ITEM(state, blockID) {
            state.blocks = state.blocks.filter(block => block._id !== blockID);
        },
    },
    actions: {
        async FETCH({commit, getters}, assignmentID) {

            commit('SET_FETCHING', true);

            let answer = await fetchAssignmentBlocks(assignmentID);

            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_BLOCKS', answer.data);
                    break;
                case 403:
                    commit('alert/ERROR', 'Отказано в доступе' || answer.statusText, {root: true});
                    break;
                default:
                    commit('alert/ERROR', 'Ошибка запроса' || answer.statusText, {root: true});
                    break;
            }
        },
    }
}

export default assignmentBlocks;