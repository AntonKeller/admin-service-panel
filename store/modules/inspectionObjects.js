import {fetchInspectionObjects} from "@/utils/api/api_inspection_objects.js";

const initial = () => ({
    objects: [],
    fetching: false,
    selectedObject: null,
});

const inspectionObjects = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_OBJECTS: (state) => state.objects,
        GET_SELECTED: (state) => state.selectedObject,
    },
    mutations: {
        SET_OBJECTS(state, payload) {
            state.objects = payload || initial().objects;
        },
        SELECT(state, inspectionObject) {
            state.selectedObject = inspectionObject;
        },
        RESET_OBJECT_LIST(state) {
            state.objects = initial().objects
        },
        RESET_SELECTED(state) {
            state.selectedObject = Object.assign(state.selectedObject, initial().selectedObject);
        }
    },
    actions: {
        async FETCH({commit, getters}, currentObjectID) {
            const answer = await fetchInspectionObjects(currentObjectID);
            switch (answer.status) {
                case 200:
                    commit('SET_OBJECTS', answer.data);
                    break;
                case 403:
                    commit('alert/ERROR', 'Отказано в доступе' || answer.statusText, {root: true});
                    break;
                default:
                    commit('alert/ERROR', 'Ошибка запроса' || answer.statusText, {root: true});
                    break;
            }
        },
    },
}

export default inspectionObjects;