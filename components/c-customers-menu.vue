<template>
  <v-card
      variant="flat"
      min-width="700"
      max-width="700"
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
            v-model="searchText"
        />
      </div>
    </v-card-item>

    <v-card-text>
      <v-list bg-color="transparent" max-height="360px" min-height="360px">
        <v-list-item v-if="loadingData">
          <v-skeleton-loader
              v-for="n of 3"
              width="full"
              color="transparent"
              elevation="0"
              type="list-item-three-line"
          />
        </v-list-item>
        <v-list-item v-for="e of customersFiltered" :key="e.id">
          <c-customer-card
              :removeClick="cardRemoveClick"
              :changeClick="cardChangeClick"
              :customerProp="e"
              @click="returnCustomer({...e})"
          />
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay v-model="customerAddMenuVisible" class="d-flex justify-center align-center">
      <c-customer-card-add-menu :returnNewCustomer="setNewCustomer"/>
    </v-overlay>

    <v-overlay v-model="customerChangeMenuVisible" class="d-flex justify-center align-center">
      <c-customer-card-change-menu
          :activeCustomer="activeChangeCustomer"
          :returnNewCustomer="changeCustomer"
      />
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
    activeChangeCustomer: ({}),
    customerAddMenuVisible: false,
    customerChangeMenuVisible: false,
    searchText: null,
    customerList: null,
  }),

  mounted() {
    this.fetchData();
  },

  computed: {
    customersFiltered() {
      if (this.customerList?.length > 0 && this.searchText !== null) {

        let expression = new RegExp(this.searchText, "ig");

        return this.customerList.filter(customer => {
          return expression.test(customer.fullName) ||
              expression.test(customer.inn) ||
              expression.test(customer.email) ||
              expression.test(customer.address);
        })
      } else {
        return this.customerList;
      }
    },
  },

  methods: {

    cardRemoveClick(id) {
      this.customerList = this.customerList.filter(customer => customer._id !== id);
    },

    cardChangeClick(_customer) {
      this.activeChangeCustomer = ({..._customer});
      this.customerChangeMenuVisible = true;
    },

    changeCustomer(newCustomer) {

      // Ищем, меняем значения заказчика
      this.customerList.forEach((customer, customerI) => {
        if (customer._id === newCustomer._id) {
          this.customerList[customerI] = ({...newCustomer})
        }
      })

      // Закрываем меню
      this.customerChangeMenuVisible = false;
    },

    setNewCustomer(newCustomer) {

      // Добавляем нового заказчика
      this.customerList.unshift(newCustomer);

      // Закрываем меню
      this.customerAddMenuVisible = false;
    },

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