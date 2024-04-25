<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Новый заказчик</v-card-title>
    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.name"
          hide-details="auto"
          label="Наименование организации"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.inn"
          hide-details="auto"
          label="ИНН"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.phoneNumber"
          hide-details="auto"
          label="Телефон"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.emailAddress"
          hide-details="auto"
          label="Почта"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.address"
          hide-details="auto"
          label="Адрес"
          clearable
      />
    </v-card-item>
    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="add">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addCustomer} from "@/utils/methods/requests";

export default {
  name: "c-customer-add-overlay",

  props: {
    hideSelf: Function,
  },

  methods: {

    add() {
      addCustomer(this.customer, 0)
          .then(r => {
            console.log('Запрос на добавление <<customer>> запрос успешно выполнен');
            // this.hideOverlay();
          })
          .catch(e => {
            console.log('Запрос на добавление <<customer>> завершен с ошибкой')
          })
          .finally(() => {
            console.log('Запрос на добавление завершен')
            this.hideSelf();
          });
    },

    clear() {
      Object.keys(this.customer).forEach(key => this.customer[key] = '');
    }
  },

  data: () => ({
    customer: {
      name: '',
      inn: '',
      phoneNumber: '',
      emailAddress: '',
      address: '',
    },
  })
}
</script>