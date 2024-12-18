<template>
  <v-container fluid>
    <v-card class="mx-auto" variant="text" :loading="fetching">

      <v-card-title>Заказчики</v-card-title>

      <v-card-item>

        <div class="d-flex align-center">
          <v-btn
              variant="tonal"
              color="blue-darken-4"
              prepend-icon="mdi-plus-box-multiple-outline"
              @click="menuAddCustomerIsShow = true"
          >
            Добавить
            <v-tooltip activator="parent">
              Добавить нового заказчика
            </v-tooltip>
          </v-btn>
          <v-sheet width="550">
            <v-text-field
                v-model="searchText"
                prepend-inner-icon="mdi-magnify"
                variant="solo-filled"
                label="Поиск заказчика"
                density="compact"
                class="ml-2"
                flat
                hide-details
                single-line
            />
          </v-sheet>
        </div>

        <v-sheet style="min-height: 600px" class="mt-2">
          <v-table height="77vh" density="comfortable" fixed-header>
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
                <my-button-table-remove :prompt="'Удалить заказчика'" @click:yes="removeCustomer(customer._id)"/>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-sheet>
      </v-card-item>
    </v-card>

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

    <v-overlay v-model="menuAddCustomerIsShow" class="d-flex justify-center align-center">
      <customer-add @add:success="onCustomerAddSuccess" @click:close="menuAddCustomerIsShow=false"/>
    </v-overlay>

    <v-overlay v-model="menuChangeCustomerIsShow" class="d-flex justify-center align-center">
      <customer-change :_customer="customerSelected" @change:success="onCustomerChangeSuccess"
                       @click:close="menuChangeCustomerIsShow=false"></customer-change>
    </v-overlay>
  </v-container>
</template>

<script>
import {fetchCustomers, removeCustomer} from "../../utils/api/api_customers";

export default {
  name: "customers-page",

  data() {
    return {
      customers: [],
      customerSelected: null,
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
            this.customers = response.data;
          })
          .catch(err => {
            console.log('Ошибка загрузки заказчиков', err);
          })
          .finally(() => {
            this.fetching = false;
          })
    },
    onCustomerAddSuccess() {
      this.menuAddCustomerIsShow = false;
      this.updateCustomers();
    },
    onCustomerChangeSuccess() {
      this.menuChangeCustomerIsShow = false;
      this.updateCustomers();
    },
    menuChangeCustomerShow(customer) {
      this.customerSelected = customer;
      this.menuChangeCustomerIsShow = true;
    },
    removeCustomer(id) {
      removeCustomer(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно удален');
            this.updateCustomers();
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления заказчика');
            console.log('Ошибка удаления заказчика', err);
          })
    }
  }
}
</script>