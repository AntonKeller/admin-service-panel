<template>
  <v-card
      variant="flat"
      min-width="600"
      max-width="600"
      color="indigo-lighten-4"
      density="comfortable"
      rounded
  >
    <v-card-title>Договоры</v-card-title>
    <v-card-subtitle>Выберите или создайте новый</v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-btn
            rounded
            color="indigo-darken-1"
            variant="elevated"
            density="default"
            size="small"
            icon="mdi-plus"
            @click="contractAddMenuVisible = true"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            prepend-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск договора"
            variant="outlined"
            hide-details
            single-line
            clearable
            v-model="searchText"
        />
      </div>
    </v-card-item>
    <v-card-text>
      <v-list bg-color="transparent" min-height="380" max-height="360">
        <v-list-item v-if="loadingData">
          <v-skeleton-loader
              v-for="n of 3"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
        </v-list-item>
        <v-list-item v-if="!contractsFiltered">Договора не найдены</v-list-item>
        <v-list-item v-for="contract of contractsFiltered" :key="contract._id">
          <c-contract-card @click="selectContract(contract)" :contract="contract"/>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-overlay v-model="contractAddMenuVisible" class="d-flex justify-center align-center">
      <c-contract-card-add-menu :returnContract="setContract"/>
    </v-overlay>
  </v-card>
</template>

<script>
import {testDataContracts} from "../configs/testData";
import {fetchContracts} from "../utils/methods/contract-requests";

export default {
  name: "c-contract-list",

  props: {
    selectContract: Function,
  },

  data: () => ({
    searchText: null,
    loadingData: true,
    contractList: null,
    contractAddMenuVisible: false,
  }),

  computed: {
    contractsFiltered() {
      if (this.searchText?.length > 0 && this.contractList?.length > 0) {

        let expression = new RegExp(this.searchText, 'i');

        let filtered = this.contractList?.filter(contract => [
          contract.contractNumber,
          contract.contractDate,
        ].find(e => expression.test(e)));

        return filtered?.length > 0 ? filtered : null;

      } else return this.contractList;
    }
  },

  mounted() {
    this.fetchData();
  },

  methods: {

    setContract(newContract) {
      if (Array.isArray(this.contractList)) {
        this.contractList.push(newContract)
      } else {
        this.contractList = [newContract];
      }
    },

    fetchData() {
      fetchContracts(500)
          .then(response => {
            this.contractList = response?.data;
            console.log('Запрос списка договоров выполнен успешно');
          })
          .catch(err => {
            this.contractList = testDataContracts;
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            console.log('Запрос списка договоров завершен');
            this.loadingData = false;
          });
    }
  }
}
</script>

<style scoped>

</style>