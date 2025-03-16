import {debounce} from "lodash";
import {ref, watch} from 'vue';

export default function () {

    const _search = ref('');
    const search = ref('');
    const searching = ref(false)

    const updateSearch = debounce(function () {
        search.value = _search.value;
        searching.value = false;
    }, 900);

    watch(_search, () => {
        searching.value = true;
        updateSearch();
    });

    return {
        _search,
        search,
        searching
    }
}