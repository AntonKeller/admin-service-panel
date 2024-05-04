<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Редактор заказчика</v-card-title>
    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.shortName"
          hide-details="auto"
          label="Наименование заказчика"
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
      <v-btn rounded="sm" variant="tonal" @click="put">Изменить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {putCustomer} from "../utils/methods/customer-requests";

export default {
  name: "c-customer-card-change-menu",

  props: {
    activeCustomer: Object,
    returnNewCustomer: Function,
  },

  methods: {

    setDefault() {
      if (this.activeCustomer) {
        this.customer = ({...this.activeCustomer});
      }
    },

    put() {
      putCustomer(this.customer, 0)
          .then(response => {
            console.log('Заказчик успешно изменен', response);
            this.clear();
            this.returnNewCustomer(response?.data);
          })
          .catch(err => {
            console.log('Не удалось изменить заказчика', err);
          })
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
      id: '',
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