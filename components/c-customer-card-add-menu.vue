<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Новый заказчик</v-card-title>
    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.shortName"
          hide-details="auto"
          label="Короткое наименование заказчика"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.fullName"
          hide-details="auto"
          label="Полное наименование заказчика"
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
          v-model="customer.email"
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
import {addCustomer} from "../utils/methods/customer-requests";

export default {
  name: "c-customer-card-add-menu",

  props: {
    returnNewCustomer: Function,
  },

  methods: {

    add() {
      addCustomer(this.customer, 0)
          .then(response => {
            console.log('Заказчик успешно добавлен', response);
            this.clear();
            this.returnNewCustomer(response?.data);
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err)
          });
    },

    clear() {
      Object.keys(this.customer).forEach(key => this.customer[key] = '');
    }
  },

  data: () => ({
    customer: {
      shortName: '',
      fullName: '',
      inn: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
  })
}
</script>