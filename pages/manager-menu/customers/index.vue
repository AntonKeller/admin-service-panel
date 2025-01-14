<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">

      <v-card variant="text" :loading="fetching">

        <v-card-title>Заказчики</v-card-title>

        <v-card-item>
          <div class="d-flex align-center">
            <v-btn
                prepend-icon="mdi-plus-box-multiple-outline"
                color="blue-grey"
                variant="tonal"
                @click="navigateToCustomerAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового заказчика
              </v-tooltip>
            </v-btn>
            <v-sheet max-width="550" width="100%">
              <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
            </v-sheet>
          </div>
        </v-card-item>

        <v-card-item>
          <v-table style="max-height: 65vh" density="comfortable" class="bg-transparent" fixed-header>
            <thead v-if="!fetching">
            <tr>
              <th>Наименование</th>
              <th>ИНН</th>
              <th>Представитель</th>
              <th>Номер тел.</th>
              <th>Email</th>
              <th>
                <v-btn
                    class="d-block ml-auto rounded"
                    icon="mdi-dots-vertical"
                    density="comfortable"
                    variant="text"
                    size="small"
                    disabled
                />
              </th>
            </tr>
            </thead>
            <tbody v-if="!fetching">
            <tr
                v-for="customer of customersSlice"
                :key="customer._id"
                class="text-caption"
            >
              <td>{{ customer.shortName || '-' }}</td>
              <td class="text-no-wrap">{{ customer.inn || '-' }}</td>
              <td class="text-no-wrap">{{ customer.representativeFullName || '-' }}</td>
              <td class="text-no-wrap">{{ customer.phoneNumber || '-' }}</td>
              <td class="text-no-wrap">{{ customer.email || '-' }}</td>
              <td style="min-width: 95px; width: 95px; max-width: 95px">
                <div class="d-flex ga-2">
                  <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToCustomerChange(customer)"/>
                  <my-button-table-remove :prompt="'Удалить заказчика'" @click:yes="removeCustomer(customer._id)"/>
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-item>

        <v-card-item v-if="customersSlice?.length === 0">
          <v-label class="d-flex justify-center pb-4 border-b-sm">
            Нет данных
          </v-label>
        </v-card-item>

        <v-card-item v-if="customersSlice && customersSlice?.length !== 0">
          <div class="d-flex align-center">
            <v-pagination
                v-model="currentPage"
                density="comfortable"
                color="blue-grey-darken-2"
                show-first-last-page
                :length="totalPages"
                :total-visible="8"
            />
          </div>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {removeCustomer} from "@/utils/api/api_customers";
import {mySearchFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";

export default {
  name: "customers-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      mySearchFieldStyle,
    }
  },

  beforeMount() {
    this.$store.dispatch('customers/FETCH_CUSTOMERS');
  },

  computed: {
    customers() {
      return this.$store.getters['customers/GET_CUSTOMERS'];
    },
    fetching() {
      return this.$store.getters['customers/GET_FETCHING'];
    },
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

    navigateToCustomerAdd() {
      navigateTo('/manager-menu/customers/customer-add');
    },

    navigateToCustomerChange(customer) {
      this.customerSelect(customer);
      navigateTo('/manager-menu/customers/customer-change');
    },

    customerSelect(customer) {
      this.$store.commit('customers/SELECT', customer);
      sessionStorage.selectedCustomer = JSON.stringify(customer);
    },

    removeCustomer(id) {
      removeCustomer(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно удален');
            this.$store.dispatch('customers/FETCH_CUSTOMERS');
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления заказчика');
            console.log('Ошибка удаления заказчика', err);
          })
    }
  }
}
</script>