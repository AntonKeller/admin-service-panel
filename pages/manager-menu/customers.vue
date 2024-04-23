<template>
  <v-card class="mx-auto" variant="text" color="blue-grey-darken-2" max-height="100%">
    <v-card-title>Заказчики/Организации</v-card-title>

    <v-card-item>
      <div class="d-flex ga-2">
        <v-btn
            rounded
            color="indigo-darken-1"
            variant="elevated"
            density="default"
            size="small"
            icon="mdi-plus"
            @click="showAddOverlay"
        />
        <v-text-field
            color="indigo-darken-1"
            :loading="true"
            append-inner-icon="mdi-magnify"
            density="compact"
            label="Поиск юзеров"
            variant="outlined"
            hide-details
            single-line
            v-model="searchText"
            @input="search"
        ></v-text-field>
      </div>
    </v-card-item>

    <v-card-text>
      <v-list bg-color="transparent" max-height="85vh">
        <v-list-item v-for="customer of customersFiltered" :key="customer.inn">
          <c-card-customer :customer="customer" @click="showChangeOverlay(customer)"/>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay v-model="addOverlay" class="d-flex justify-center align-center">
      <c-customer-add-overlay :hide-overlay="hideOverlays"/>
    </v-overlay>

    <v-overlay v-model="changeOverlay" class="d-flex justify-center align-center">
      <c-customer-change-overlay :hide-overlay="hideOverlays" :activeCustomer="activeCustomer"/>
    </v-overlay>

  </v-card>
</template>

<script>
import {testDataCustomers} from '../../configs/testDataCustomers';
import {fetchCustomers} from '../../utils/methods/requests-customers';

export default {
  name: "customers-page",

  data: () => ({
    addOverlay: false,
    changeOverlay: false,
    activeCustomer: null,
    searchText: '',
    customersFiltered: [],
    customers: [],
    fetchCustomers: fetchCustomers,
  }),

  mounted() {
    this.fetchCustomersData();
    setInterval(() => this.fetchCustomersData(), 30 * 1000);
  },

  methods: {

    showChangeOverlay(_customer) {
      this.activeCustomer = _customer;
      this.changeOverlay = true;
    },

    showAddOverlay() {
      this.activeCustomer = null;
      this.addOverlay = true;
    },

    hideOverlays() {
      this.addOverlay = false;
      this.changeOverlay = false;
    },

    search() {
      this.customersFiltered = this.searchText?.length > 0 ? this.filter() : this.customers;
    },

    strInclude(s1, s2) {
      return s1.indexOf(s2) !== -1;
    },

    filter() {
      return this.customers.filter(customer => [
        customer.name,
        customer.inn,
        customer.phoneNumber,
        customer.emailAddress,
        customer.address
      ].find(e => this.strInclude(e?.toLowerCase(), this.searchText?.toLowerCase())) || null);
    },

    fetchCustomersData() {
      fetchCustomers(1500)
          .then(data => {
            this.customers = data;
          })
          .catch(err => {
            console.log('Ошибка получения заказчиков/организаций\n', err);
            this.customers = testDataCustomers;
          })
          .finally(() => {
            this.search()
          })
    },

  }
}
</script>

<style scoped>

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #D1C4E9;
  /*box-shadow: inset 0 0 5px #B39DDB;*/
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #7E57C2;
  border-radius: 6px;
}

</style>