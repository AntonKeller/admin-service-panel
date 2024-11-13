<template>
  <v-container fluid>
    <v-card class="mx-auto" variant="text" :loading="fetching">

      <v-card-title>Шаблоны</v-card-title>

      <v-card-item>
        <div class="d-flex ga-4 align-center">
          <my-search-bar
              v-model="searchText"
              :hint="`Найдено: ${5}`"
              style="min-width: 500px"
              @btn:click="menuAddCustomerIsShow = true"
          />
        </div>
      </v-card-item>
    </v-card>

    <div style="min-height: 700px" class="mt-4">
      <v-divider/>
      <v-table
          style="height: 700px"
          density="comfortable"
          class="text-caption"
          fixed-header
      >
        <thead v-if="!fetching">
        <tr>
          <th>Наименование</th>
          <th>ИНН</th>
          <th>Email</th>
          <th>Номер тел.</th>
          <th>Юридический адрес</th>
          <th></th>
        </tr>
        </thead>
        <tbody v-if="!fetching">
        <tr
            v-for="(customer, i) of customersSlice"
            :key="customer._id"
            @click="menuChangeCustomerShow(customer)"
        >
          <td>{{ customer.fullName }}</td>
          <td>{{ customer.inn }}</td>
          <td>{{ customer.email }}</td>
          <td>{{ customer.phoneNumber }}</td>
          <td>{{ customer.address }}</td>
          <td style="min-width: 65px; width: 65px; max-width: 65px">
            <c-remove-btn :prompt="'Удалить заказчика'" @click:yes="removeCustomer(customer._id)"/>
          </td>
        </tr>
        </tbody>
      </v-table>

      <v-divider/>
    </div>

    <div class="d-flex align-center mt-4">
      <v-pagination
          v-model="currentPage"
          density="comfortable"
          color="blue-grey-darken-2"
          show-first-last-page
          :length="totalPages"
          :total-visible="8"
      />
    </div>
  </v-container>

  <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
    <v-icon>mdi-alert-circle-outline</v-icon>
    {{ snackBar.msg }}
  </v-snackbar>

  <v-overlay v-model="menuAddCustomerIsShow" class="d-flex justify-center align-center">
    <customer-add @add:success="updateCustomers" />
  </v-overlay>

  <v-overlay v-model="menuChangeCustomerIsShow" class="d-flex justify-center align-center">
    <customer-change :_customer="customerSelected" @change:success="updateCustomers"></customer-change>
  </v-overlay>
</template>

<script>
import {fetchCustomers, removeCustomer} from "../../utils/api/api_customers";
import {showAlert} from "../../utils/functions.js";

export default {
  name: "customers-page",

  data() {
    return {
      customers: [],
      customerSelected: null,
      snackBar: {},
      fetching: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 25,
      menuAddCustomerIsShow: false,
      menuChangeCustomerIsShow: false,
    }
  },

  mounted() {
    this.updateCustomers();
  },

  computed: {
    totalPages() {
      return Math.ceil(this.customersFoundCount / this.itemsPerPage);
    },
    customersFoundCount() {
      return this.customersFound.length;
    },
    customersSlice() {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = this.currentPage * this.itemsPerPage;
      return this.customersFound.slice(from, to);
    },
    customersFound() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.customers.filter(e => {
          return (new RegExp(this.searchText, 'ig')).test([
            e?.fullName || null,
            e?.shortName || null,
            e?.inn || null,
            e?.address || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.customers;
      }
    }
  },

  methods: {
    updateCustomers() {
      this.fetching = true;
      fetchCustomers()
          .then(response => {
            this.customers = response.data.data;
          })
          .catch(err => {
            console.log('Ошибка загрузки заказчиков', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },
    menuChangeCustomerShow(customer) {
      this.customerSelected = customer;
      this.menuChangeCustomerIsShow = true;
    },
    removeCustomer(id) {
      removeCustomer(id)
          .then(() => {
            this.snackBar = showAlert('Успешно удален').success();
          })
          .catch((err) => {
            this.snackBar = showAlert('Ошибка удаления').error();
            console.log('Ошибка удаления', err);
          })
    }
  }
}
</script>