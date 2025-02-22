<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1150">
      <v-card variant="text">

        <v-card-title>Заказчики</v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-account-tie-outline"/>
          Добавляйте заказчиков в таблицу и работайте в привычном формате
        </v-card-subtitle>

        <v-card-item/>

        <v-card-item>
          <v-card-title class="d-flex align-center">
            <v-btn v-bind="myBtnPlus" @click="onAddCustomer">
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
          <v-sheet v-bind="myTableSheetStyle">
            <v-data-table
                :items="itemsMap"
                :headers="headers"
                :search="searchText"
                :loading="fetchingItems"
                items-per-page-text="Кол-во на странице"
                no-data-text="Нет данных"
                class="bg-transparent"
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
                <my-change-button prompt="Редактировать ТЗ" @click.stop="onChangeCustomer(item._id)"/>
                <my-button-table-remove :prompt="'Удалить'" @click:yes="removeCustomer(item._id)" class="ml-2"/>
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {addCustomer, fetchCustomers, removeCustomer} from "@/utils/api/api_customers";
import {myBtnPlus, mySearchFieldStyle, myTableSheetStyle} from "@/configs/styles";
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
      items: [],
      fetchingItems: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,

      // IMPORT STYLES
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  beforeMount() {
    this.fetchCustomers();
  },

  computed: {
    itemsMap() {
      return this.itemsSearchFilter;
    },
    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.items.filter(e => {
          return (new RegExp(this.searchText, 'ig')).test([
            e?.fullName || null,
            e?.shortName || null,
            e?.inn || null,
            e?.address || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.items;
      }
    }
  },

  methods: {

    fetchCustomers() {
      this.fetchingItems = true;
      fetchCustomers()
          .then(response => {
            this.items = response.data;
          })
          .catch(err => {
            console.log('Ошибка загрузки списка заказчиков', err);
            this.$store.commit('alert/ERROR', 'Ошибка загрузки списка заказчиков');
          })
          .finally(() => {
            this.fetchingItems = false;
          });
    },

    onAddCustomer() {
      // TODO: Логика добавления
      const customer = {
        _id: null,
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        actualAddress: null,
        email: null,
        phoneNumber: null,
        representativeFullName: null,
        representativePosition: null,
        template: null,
      }

      addCustomer(customer)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Добавлен новый заказчик');
            this.$store.dispatch('customers/FETCH_CUSTOMERS');
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    onChangeCustomer(id) {
      navigateTo(`/manager/customers/${id}/change`);
    },

    removeCustomer(id) {
      removeCustomer(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно удален');
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления заказчика');
            console.log('Ошибка удаления заказчика', err);
          })
    }
  }
}
</script>