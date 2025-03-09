import {
    createTemplate,
    downloadExcelTemplate,
    fetchTemplates,
    removeTemplate,
    uploadExcelTemplate
} from "@/utils/api/templates";
import {useStore} from 'vuex';
import {ref} from 'vue';

export default function () {

    const store = useStore();
    const fetching = ref(false);
    const templatesCollection = ref([]);
    const templatesCollectionCount = ref(0);


    const fetchTemplatesCollection = async () => {
        fetching.value = true;
        templatesCollection.value = await fetchTemplates()
            .then((response) => {
                return response?.data;
            })
            .catch((err) => {
                console.log('Ошибка получения данных', err);
                store.commit('alert/ERROR', 'Ошибка получения данных');
            })
            .finally(() => {
                fetching.value = false;
            })
    }


    const createNewTemplate = () => {
        createTemplate({
            _id: null,
            title: '[без названия]',
            isBase: false,
        }).then(async () => {
            await fetchTemplatesCollection();
            store.commit('alert/SUCCESS', 'Создан новый шаблон');
        }).catch(err => {
            console.log('Ошибка создания шаблона', err);
            store.commit('alert/ERROR', 'Ошибка создания шаблона');
        })
    }


    return {
        fetching,
        createNewTemplate,
        templatesCollection,
        templatesCollectionCount,
        fetchTemplatesCollection
    }
}