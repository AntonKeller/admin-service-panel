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
        FETCH({commit, getters}, currentObjectID) {
            fetchInspectionObjects(currentObjectID)
                .then(response => {
                    console.log('objects:', response.data);
                    commit('SET_OBJECTS', response.data);
                })
                .catch(err => {
                    commit('alert/ERROR', 'Ошибка загрузки инспектируемых объектов', {root: true});
                    console.log('Ошибка загрузки инспектируемых объектов', err);
                });
        },
    },
}

export default inspectionObjects;