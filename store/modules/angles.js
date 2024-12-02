import {fetchImages} from "@/utils/api/api_images.js";
import assignments from "@/store/modules/assignments.js";
import {fetchAngles} from "@/utils/api/api_angles.js";

export const initial = () => ({
    angles: [],
    fetching: false,
    alert: {}
});

const angles = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_ANGLES_NAMES: (state) => Object.values(state.angles).map(item => item.name),
        HAS_ANGLE: (state) => (ID) => state.angles.find(angle => angle._id === ID),
        GET_PHOTO_COUNT: (state) => state.angles.reduce((num, item) => num + item.photoList.length, 0),
        GET_ANGLES: (state) => state.angles,
        GET_ANGLE_BY_ID: (state) => (ID) => state.angles.find(e => e._id === ID),
        GET_ALERT: (state) => state.alert,
    },
    mutations: {
        SET_ANGLES(state, data) {
            state.angles = data;
        },
        SET_FETCHING(state, status) {
            state.fetching = status;
        },
        RESET(state) {
            state = Object.assign(state, initial());
        },
        SHOW_ALERT_SUCCESS(state, payload) {
            state.alert = {type: 'teal-darken-1', msg: payload, isShow: true}
        },
        SHOW_ALERT_ERROR(state, payload) {
            state.alert = {type: 'red-darken-4', msg: payload, isShow: true}
        },
    },
    actions: {
        async FETCH({commit, getters}, objectID) {

            commit('SET_FETCHING', true);
            let answer = await fetchAngles(objectID);
            commit('SET_FETCHING', false);

            console.log('[ANGLES] answer.data', answer.data)

            switch (answer.status) {
                case 200:
                    commit('SET_ANGLES', answer.data);
                    break;
                case 403:
                    // commit('SHOW_ALERT_ERROR', 'Отказано в доступе' || answer.statusText);
                    break;
                default:
                    // commit('SHOW_ALERT_ERROR', 'Ошибка запроса' || answer.statusText);
                    break;
            }
        }
    }
}

export default angles;