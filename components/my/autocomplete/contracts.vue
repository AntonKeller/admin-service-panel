<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        :items="contracts"
        :loading="contractsFetching"
        :custom-filter="contractSearchFilter"
        @update:menu="onUpdateMenuContracts"
        prepend-inner-icon="mdi-file-document-edit"
        no-data-text="нет данных"
        color="yellow-darken-3"
        variant="outlined"
        density="compact"
        label="Договор"
        closable-chips
        hide-selected
        chips
        v-bind="$attrs"
    >
      <template #chip="{ props, item }">
        <v-chip
            v-bind="props"
            :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
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
            :title="item.raw?.number"
            :subtitle="unixDateToLongDateString(item.raw?.date)"
        >
          <template #append>
            <v-btn
                icon="mdi-progress-close"
                color="red-darken-4"
                density="comfortable"
                variant="text"
                @click.stop="removeContract(item.raw._id)"
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
        v-if="!hideButtonAdd"
        icon="mdi-plus"
        variant="text"
        rounded="lg"
        size="small"
        @click="contractMenuAddVisible = true"
    >
      <v-icon/>
      <v-tooltip activator="parent" location="left">
        Добавить новый договор
      </v-tooltip>
    </v-btn>
    <v-overlay v-model="contractMenuAddVisible" class="d-flex justify-center align-center">
      <my-form-contract-add @add:success="onContractAddSuccess" @click:close="contractMenuAddVisible = false"/>
    </v-overlay>
  </div>
</template>

<script>
import {unixDateToLongDateString} from "../../../utils/functions";
import {fetchContracts, removeContract} from "../../../utils/api/api_contracts";

export default {
  name: "contracts",

  props: {
    hideButtonAdd: Boolean,
  },

  data() {
    return {
      contractsList: [], // TODO: Запросы и Vue вывод полей
      contractsFetching: false,
      contractMenuAddVisible: false,
      contractRules: [v => v || 'Договор должен быть выбран'],
    }
  },

  computed: {
    contracts() {
      return this.contractsList?.filter(contract => !contract.parent) || [];
    },
  },

  methods: {

    unixDateToLongDateString,

    onContractAddSuccess() {
      this.fetchContractsList();
      this.contractMenuAddVisible = false;
    },

    onUpdateMenuContracts(status) {
      if (status) this.fetchContractsList();
    },

    contractSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    removeContract(id) {
      removeContract(id)
          .then(() => {
            this.fetchContractsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    async fetchContractsList() {
      this.contractsFetching = true;
      const answer = await fetchContracts();
      switch (answer.status) {
        case 200:
          this.contractsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о договорах');
          break;
      }
      this.contractsFetching = false;
    },
  }
}
</script>