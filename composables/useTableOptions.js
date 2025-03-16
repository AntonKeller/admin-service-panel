import {ref} from 'vue';

export default function () {

    const itemsPerPage = ref(10);

    const itemsPerPageOptions = ref([
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
    ]);

    return {
        itemsPerPage,
        itemsPerPageOptions,
    }
}