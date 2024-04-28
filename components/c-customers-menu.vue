<template>
  <v-card
      variant="flat"
      min-width="600"
      max-width="600"
      color="indigo-lighten-4"
      density="comfortable"
      rounded
  >

    <v-card-title>Заказчики</v-card-title>

    <v-card-subtitle>Выберите из списка</v-card-subtitle>

    <v-card-item>
      <div class="d-flex ga-2">
        <v-btn
            rounded
            color="indigo-darken-1"
            variant="elevated"
            density="default"
            size="small"
            icon="mdi-plus"
            @click="customerAddMenuVisible = true"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск заказчика"
            variant="outlined"
            hide-details
            single-line
        />
      </div>
    </v-card-item>

    <v-card-text>
      <v-list bg-color="transparent" max-height="360px">
        <v-list-item v-if="loadingData">
          <v-skeleton-loader
              v-for="n of 3"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
        </v-list-item>
        <v-list-item v-for="e of customerList" :key="e.id">
          <c-customer-card @click="returnCustomer({...e})" :customerProp="e"/>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay v-model="customerAddMenuVisible" class="d-flex justify-center align-center">
<!--      <c-contract-card-add-menu :returnContract="setContract"/>-->
<!--      <c-customer-card-add :customerProp= />-->
    </v-overlay>

  </v-card>
</template>

<script>
import {testDataCustomers} from "../configs/testData";
import {fetchCustomers} from "../utils/methods/customer-requests";

export default {
  name: "c-customers-menu",

  props: {
    returnCustomer: Function,
  },

  data: () => ({
    loadingData: true,
    customerAddMenuVisible: false,
    customerList: null,
  }),

  mounted() {
    this.fetchData();
  },

  methods: {

    setCustomer(newCustomer) {
      if (Array.isArray(this.customerList)) {
        this.customerList.push(newCustomer)
      } else {
        this.customerList = [newCustomer];
      }
    },

    fetchData() {
      fetchCustomers(500)
          .then(response => {
            this.customerList = response?.data;
            console.log('Запрос списка заказчиков выполнен успешно');
          })
          .catch(err => {
            this.customerList = testDataCustomers;
            console.log('Запрос списка заказчиков выполнен с ошибкой', err);
          })
          .finally(() => {
            this.loadingData = false;
            console.log('Запрос списка заказчиков завершен');
            console.log('customerList', this.customerList)
          });
    }
  }
}
</script>