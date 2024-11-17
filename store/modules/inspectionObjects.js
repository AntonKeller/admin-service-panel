import {fetchInspectionObjects} from "@/utils/api/api_inspection_objects.js";

const initial = () => ({
    objects: [],
    fetching: false,
    selectedObject: null,
    alert: {},
});

const inspectionObjects = {
    namespaced: true,
    state: () => initial(),
    getters: {
        GET_OBJECTS: (state) => state.objects,
        GET_SELECTED_OBJECT: (state) => {
            console.log('[store-inspection-objects]:[GET_SELECTED_OBJECT] value = ', state.selectedObject)
            return state.selectedObject;
        },
        GET_FETCHING: (state) => {
            console.log('[store-inspection-objects]:[GET_FETCHING] value = ', state.fetching)
            return state.fetching;
        },
        GET_ALERT: (state) => state.alert,
    },
    mutations: {
        SET_OBJECTS(state, payload) {
            state.objects = payload || initial().objects;
        },
        SELECT(state, inspectionObject) {
            state.selectedObject = inspectionObject;
        },
        ALERT_SUCCESS(state, payload) {
            state.alert = {type: 'teal-darken-1', msg: payload, isShow: true}
        },
        ALERT_ERROR(state, payload) {
            state.alert = {type: 'red-darken-4', msg: payload, isShow: true}
        },
        RESET(state) {
            console.log('[store-inspection-objects]:[RESET]')
            state = Object.assign(state, initial());
        },
        RESET_OBJECT_LIST(state) {
            state.objects = Object.assign(state.objects, initial().objects);
        },
        RESET_SELECTED(state) {
            console.log('[store-inspection-objects]:[RESET_SELECTED]')
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
                default:
                    commit('ALERT_ERROR', 'Ошибка запроса' || answer.statusText);
                    break;
            }
        },
    },
}

export default inspectionObjects;