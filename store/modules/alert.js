const initial = () => ({
    color: null,
    visible: null,
    message: null,
});

const alert = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_TYPE: (state) => state.color,
        GET_MESSAGE: (state) => state.message,
        GET_VISIBLE: (state) => state.visible,
    },
    mutations: {
        SET_VISIBLE(state, value) {
            state.visible = value;
        },
        SUCCESS(state, message) {
            state.message = message;
            state.color = 'teal-darken-1';
            state.visible = true;
        },
        ERROR(state, message) {
            state.message = message;
            state.color = 'red-darken-4';
            state.visible = true;
        }
    },
    actions: {},
}

export default alert;