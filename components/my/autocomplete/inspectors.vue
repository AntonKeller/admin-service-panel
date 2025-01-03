<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="inspectors"
        :loading="fetching"
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
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.firstName || ''} ${item.raw?.surname || ''} ${item.raw?.lastName || ''}`"
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
            :title="`${item.raw?.firstName || ''} ${item.raw?.surname || ''} ${item.raw?.lastName || ''}`"
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
        @click="inspectorFormAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить инспектора
      </v-tooltip>
    </v-btn>
    <v-overlay v-model="inspectorFormAddVisible" class="d-flex align-center justify-center">
      <my-form-inspector-add @add:success="onInspectorAddSuccess" @click:close="inspectorFormAddVisible=false"/>
    </v-overlay>
  </div>
</template>

<script>
import {fetchInspectors, removeInspector} from "../../../utils/api/api_inspectors";
import alert from "../../../store/modules/alert.js";

export default {
  name: "inspectors",

  data() {
    return {
      inspectorsList: [], // TODO: Запросы и Vue вывод полей
      fetching: false,
      inspectorFormAddVisible: false,
      inspectorRules: [v => v || 'Выберите инспектора'],
    }
  },
  computed: {
    inspectors() {
      return this.inspectorsList?.filter(inspector => !inspector.parent) || [];
    },
  },
  methods: {

    onInspectorAddSuccess() {
      this.fetchInspectorsList();
      this.inspectorFormAddVisible = false;
    },

    onUpdateMenuInspectors(status) {
      if (status) this.fetchInspectorsList();
    },

    inspectorSearchFilter(value, query, item) {
      return [
        item.raw?.firstName || null,
        item.raw?.surname || null,
        item.raw?.lastName || null,
        item.raw?.email || null,
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

      this.fetching = true;

      fetchInspectors()
          .then(response => {
            this.inspectorsList = response.data;
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Ошибка получения списка инспекторов');
            console.log('Ошибка получения списка инспекторов', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },
  }
}
</script>