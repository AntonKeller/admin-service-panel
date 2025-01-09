import {fetchInspectors} from "@/utils/api/api_inspectors";

const initial = () => ({
    inspectors: [],
    fetching: false,
    selectedInspector: {},
});

const inspectors = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_INSPECTORS: (state) => state.inspectors,
        GET_SELECTED: (state) => state.selectedInspector,
        GET_FETCHING: (state) => state.fetching,
    },
    mutations: {
        SET_INSPECTORS(state, array) {
            state.inspectors = array || initial().inspectors;
        },
        SELECT(state, inspector) {
            state.selectedInspector = inspector || initial().selectedInspector;
        },
        RESET_SELECTED(state) {
            state.selectedInspector = initial().selectedInspector;
        },
        RESET_INSPECTORS(state) {
            state.inspectors = initial().inspectors;
        },
        SET_FETCHING(state, value) {
            state.fetching = value || initial().fetching;
        },
    },
    actions: {
        FETCH({commit}) {

            commit('SET_FETCHING', true);

            fetchInspectors()
                .then(response => {
                    commit('SET_INSPECTORS', response.data);
                })
                .catch(err => {
                    commit('alert/ERROR', 'Ошибка получения списка инспекторов', {root: true});
                    console.log('Ошибка получения списка инспекторов', err);
                })
                .finally(() => {
                    commit('SET_FETCHING', false);
                })
        }
    }
}

export default inspectors;