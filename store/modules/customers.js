import {fetchCustomers} from "../../utils/api/api_customers";

export const initial = () => ({
    customers: [],
    fetching: false,
    selected: {},
});

const customers = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_CUSTOMERS: (state) => state.customers,
        GET_SELECTED: (state) => state.selected,
        GET_FETCHING: (state) => state.fetching,
    },
    mutations: {
        SET_CUSTOMERS(state, array) {
            state.customers = array || initial().customers;
        },
        SELECT(state, item) {
            state.selected = item || initial().selected;
        },
        SET_FETCHING(state, value) {
            state.fetching = value;
        },
    },
    actions: {
        FETCH_CUSTOMERS({commit}) {

            commit('SET_FETCHING', true);

            fetchCustomers()
                .then(response => {
                    commit('SET_CUSTOMERS', response.data);
                })
                .catch(err => {
                    commit('alert/ERROR', 'Ошибка получения списка заказчиков', {root: true});
                    console.log('Ошибка получения списка заказчиков', err);
                })
                .finally(() => {
                    commit('SET_FETCHING', false);
                });
        }
    }
}

export default customers;