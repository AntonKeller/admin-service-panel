<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1150">
      <v-card variant="text" :loading="fetching">

        <v-card-title>Заказчики</v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-account-tie-outline"/>
          Добавляйте заказчиков в таблицу и работайте в привычном формате
        </v-card-subtitle>

        <v-card-item/>

        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-btn
                variant="outlined"
                class="bg-blue-darken-2"
                @click="navigateToCustomerAdd"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить нового заказчика
              </v-tooltip>
            </v-btn>
            <v-spacer/>
            <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
          </v-card-title>
        </v-card-item>

        <v-card-item>
          <v-sheet class="border-sm rounded-lg bg-white px-6 pt-4 pb-1">
            <v-data-table
                :items="customersSlice"
                :headers="headers"
                :search="searchText"
                class="bg-transparent"
                items-per-page-text="Кол-во на странице"
                no-data-text="Нет данных"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                show-select
            >
              <template #item.inn="{ item }">
                {{ item?.inn ?? '-' }}
              </template>
              <template #item.phoneNumber="{ item }">
                {{ item?.phoneNumber ?? '-' }}
              </template>
              <template v-slot:item.actions="{ item }">
                <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToCustomerChange(item)"/>
                <my-button-table-remove :prompt="'Удалить'" @click:yes="removeCustomer(item._id)" class="ml-2"/>
              </template>
              <template #loading>
                <v-skeleton-loader type="table-row@10"/>
              </template>
            </v-data-table>
          </v-sheet>
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
      headers: [
        {
          align: 'start',
          key: 'shortName',
          value: 'shortName',
          sortable: true,
          title: 'Организация',
        },
        {
          align: 'start',
          key: 'inn',
          value: 'inn',
          sortable: true,
          title: 'ИНН Организации',
          nowrap: true,
        },
        {
          align: 'start',
          key: 'representativeFullName',
          value: 'representativeFullName',
          sortable: true,
          title: 'Представитель',
        },
        {
          align: 'start',
          key: 'phoneNumber',
          sortable: true,
          title: 'Номер представителя',
          nowrap: true,
        },
        {
          align: 'start',
          key: 'email',
          sortable: true,
          title: 'Email',
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          width: 100,
        },
      ],

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