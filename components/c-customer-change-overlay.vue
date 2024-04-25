<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Редактор заказчика</v-card-title>
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
      <v-btn rounded="sm" variant="tonal" @click="put">Изменить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {putCustomer} from "../utils/methods/requests";

export default {
  name: "c-customer-change-overlay",

  props: {
    activeCustomer: Object,
    hideOverlay: Function,
  },

  methods: {

    setDefault() {
      if (this.activeCustomer) {
        this.customer = ({...this.activeCustomer});
      }
    },

    put() {
      putCustomer(this.customer, 0)
          .then(r => {
            console.log('Запрос на изменение <<customer>> запрос успешно выполнен');
            // this.hideOverlay();
          })
          .catch(e => {
            console.log('Запрос на изменение <<customer>> завершен с ошибкой');
          })
          .finally(() => {
            console.log('Запрос на изменение завершен');
            this.hideOverlay();
          });
    },
    clear() {
      Object.keys(this.customer).forEach(key => this.customer[key] = '');
    }
  },

  mounted() {
    this.setDefault();
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

<style scoped>

</style>