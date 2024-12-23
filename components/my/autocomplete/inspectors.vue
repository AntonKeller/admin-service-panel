<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :items="inspectors"
        :loading="inspectorsFetching"
        :custom-filter="inspectorSearchFilter"
        @update:menu="onUpdateMenuInspectors"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Инспектор"
        closable-chips
        hide-selected
        chips
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.firstName || ''} ${item.raw?.surName || ''} ${item.raw?.lastName || ''}`"
            prepend-icon="mdi-file-document-edit"
            color="blue-grey-darken-3"
            density="comfortable"
            label
        />
      </template>

      <template #item="{ props, item }">
        <v-list-item
            v-bind="props"
            prepend-icon="mdi-file-document-edit"
            :title="`${item.raw?.firstName || ''} ${item.raw?.surName || ''} ${item.raw?.lastName || ''}`"
            :subtitle="`${item.raw?.phoneNumber} / ${item.raw?.email}`"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removeInspector(item.raw._id)"
            >
              <v-icon/>
              <v-tooltip activator="parent">
                Удалить запись
              </v-tooltip>
            </v-btn>
          </template>
        </v-list-item>
      </template>
    </v-autocomplete>
    <v-btn
        icon="mdi-plus"
        variant="text"
        rounded="lg"
        size="small"
        @click="inspectorMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить инспектора
      </v-tooltip>
    </v-btn>
  </div>
</template>

<script>
import {fetchInspectors, removeInspector} from "../../../utils/api/api_inspectors";

export default {
  name: "inspectors",

  data() {
    return {
      inspectorsList: [], // TODO: Запросы и Vue вывод полей
      inspectorsFetching: false,
      inspectorMenuAddVisible: false,
      inspectorRules: [v => v || 'Выберите инспектора'],
    }
  },
  computed: {
    inspectors() {
      return this.inspectorsList?.filter(inspector => !inspector.parent) || [];
    },
  },
  methods: {

    onUpdateMenuInspectors(status) {
      if (status) this.fetchInspectorsList();
    },

    inspectorSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    removeInspector(id) {
      removeInspector(id)
          .then(() => {
            this.fetchInspectorsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    async fetchInspectorsList() {
      this.inspectorsFetching = true;
      const answer = await fetchInspectors();
      switch (answer.status) {
        case 200:
          this.inspectorsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о инспекторах');
          break;
      }
      this.inspectorsFetching = false;
    },
  }
}
</script>