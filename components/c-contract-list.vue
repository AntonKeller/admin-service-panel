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
            @click="contractAddOverlayVisible = true"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск договора"
            variant="outlined"
            hide-details
            single-line
        ></v-text-field>
      </div>
    </v-card-item>
    <v-card-text>
      <v-list bg-color="transparent" max-height="360px">
        <v-list-item v-for="e of contractList" :key="e.id">
          <c-contract-card @click="selectContract(e)" :contract="e"/>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-overlay v-model="contractAddOverlayVisible" class="d-flex justify-center align-center">
      <!--      // ...............-->
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
    contractList: null,
    contractAddOverlayVisible: false,
  }),

  mounted() {
    this.updateContractData();
  },

  methods: {
    updateContractData() {
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
          });
    }
  }
}
</script>

<style scoped>

</style>