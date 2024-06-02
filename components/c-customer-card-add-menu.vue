<template>
  <v-card
      :loading="loading"
      :disabled="loading"
      density="compact"
      variant="elevated"
      min-width="480"
      rounded
  >

    <v-card-title>Новый заказчик</v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text class="d-flex flex-column ga-2">
      <v-text-field
          v-for="field of config.fields"
          v-model="customer[field.key]"
          :key="field.key"
          :label="field.ru"
          density="comfortable"
          hide-details="auto"
          clearable
      />
    </v-card-text>

    <v-card-actions>
      <v-btn
          @click="add"
          rounded="lg"
          variant="tonal"
          :loading="loading"
      >
        Добавить
      </v-btn>
      <v-btn
          @click="clear"
          rounded="lg"
          variant="tonal"
      >
        Очистить
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import {addCustomer} from "../utils/methods/customer-requests";
import customerConfig from "../configs/customer-config";

export default {
  name: "c-customer-card-add-menu",

  props: {
    returnNewCustomer: Function,
    requestCompleteEvent: Function
  },

  data: () => ({
    config: customerConfig,
    customer: ({}),
    loading: false,
  }),

  methods: {

    add() {
      this.loading = true;
      addCustomer(this.customer)
          .then(response => {
            this.clear();
            this.returnNewCustomer(response?.data);
            this.requestCompleteEvent('teal-accent-3', 'Заказчик успешно добавлен');
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.requestCompleteEvent('red-accent-3', 'Ошибка добавления заказчика')
          })
          .finally(() => {
            this.loading = false;
            this.snackBarShow = true;
          })
    },

    clear() {
      customerConfig.fields.forEach(f => this.customer[f.key] = '');
    }
  },
}
</script>