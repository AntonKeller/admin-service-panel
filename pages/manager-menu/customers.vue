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
            @click="overlay = true"
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
          <c-card-customer :customer="customer"/>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay v-model="overlay" class="d-flex justify-center align-center">
      <c-customer-add-overlay />
    </v-overlay>
  </v-card>
</template>

<script>
import {testDataCustomers} from '../../configs/testDataCustomers';
import {fetchCustomers} from '../../utils/methods/fetch-customers';

export default {
  name: "customers-page",

  data: () => ({
    overlay: false,
    searchText: '',
    customersFiltered: [],
    customers: [],
  }),

  mounted() {
    this.fetchData();
    setInterval(() => this.fetchData(), 30 * 1000);
  },

  methods: {

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

    fetchData() {
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
    }
  }
}
</script>

<style scoped>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #D1C4E9;
  /*box-shadow: inset 0 0 5px #B39DDB;*/
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #7E57C2;
  border-radius: 6px;
}
</style>