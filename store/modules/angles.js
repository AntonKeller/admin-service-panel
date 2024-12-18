import {fetchAngles} from "@/utils/api/api_angles.js";

const initial = () => ({
    angles: [],
    fetching: false,
});

const angles = {
    namespaced: true,
    state: () => initial(),
    getters: {
        HAS_ANGLE: (state) => (ID) => state.angles.find(angle => angle._id === ID),
        GET_PHOTO_COUNT: (state) => state.angles.reduce((num, item) => num + item.photoList.length, 0),
        GET_ANGLES: (state) => state.angles,
        GET_ANGLE_BY_ID: (state) => (ID) => state.angles.find(e => e._id === ID),
    },
    mutations: {
        SET_ANGLES(state, data) {
            state.angles = data;
        },
        SET_FETCHING(state, status) {
            state.fetching = status;
        },
    },
    actions: {
        async FETCH({commit, getters}, objectID) {

            commit('SET_FETCHING', true);

            let answer = await fetchAngles(objectID);

            commit('SET_FETCHING', false);

            switch (answer.status) {
                case 200:
                    commit('SET_ANGLES', answer.data);
                    break;
                case 403:
                    commit('alert/ERROR', 'Отказано в доступе' || answer.statusText, {root: true});
                    break;
                default:
                    commit('alert/ERROR', 'Ошибка получения ракурсов' || answer.statusText, {root: true});
                    break;
            }
        }
    }
}

export default angles;