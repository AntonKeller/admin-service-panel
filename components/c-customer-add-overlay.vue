<template>
  <v-card density="compact" rounded="lg" variant="elevated" min-width="480" color="indigo-lighten-4">
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
      <v-btn rounded="lg" variant="tonal" @click="sendCustomer">Добавить</v-btn>
      <v-btn rounded="lg" variant="tonal" @click="clearFields">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addCustomer} from '../utils/methods/fetch-customers'

export default {
  name: "c-customer-add-overlay",

  data: () => ({
    customer: {
      name: '',
      inn: '',
      phoneNumber: '',
      emailAddress: '',
      address: '',
    }
  }),

  methods: {

    clearFields() {
      Object.keys(this.customer).forEach(key => this.customer[key] = '');
    },

    sendCustomer() {
      addCustomer(this.customer)
          .then(() => {
            console.log('Новый заказчик добавлен');
            this.clearFields();
          })
          .catch(() => {
            console.log('Ошибка добавления заказчика')

          })
    }
  }
}
</script>

<style scoped>

</style>