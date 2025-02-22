import {fetchAngles} from "@/utils/api/api_angles";

const initial = () => ({
    angles: [],
    fetching: false,
});

const angles = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_ANGLES: (state) => state.angles,
    },
    mutations: {
        SET_ANGLES(state, angles) {
            state.angles = angles;
            console.log('fetch result angles:', angles)
        },
        SET_FETCHING(state, status) {
            state.fetching = status;
        },
        REMOVE_PHOTO_BY_ID(state, photoID) {
            state.angles = state.angles
                .map(angle => {
                    const filtered = angle?.photoList.filter(photo => photo._id !== photoID) || [];
                    return filtered.length > 0 ? {
                        description: angle?.description,
                        name: angle?.name,
                        photoList: angle?.photoList.filter(photo => photo._id !== photoID) || [],
                    } : null;
                })
                .filter(angle => {
                    return !!angle;
                });
        }
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