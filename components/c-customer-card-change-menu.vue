<template>
  <v-card
      :loading="loading"
      :disabled="loading"
      density="compact"
      rounded
      variant="elevated"
      min-width="480"
  >

    <v-card-title>Редактор заказчика</v-card-title>

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
          rounded="sm"
          variant="tonal"
          @click="put"
          :loading="loading"
      >
        Изменить
      </v-btn>
      <v-btn
          rounded="sm"
          variant="tonal"
          @click="clear"
      >
        Очистить
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import {putCustomer} from "../utils/methods/customer-requests";
import customerConfig from "../configs/customer-config";

export default {
  name: "c-customer-card-change-menu",

  props: {
    activeCustomer: Object,
    returnNewCustomer: Function,
    requestCompleteEvent: Function,
  },

  data: () => ({
    config: customerConfig,
    customer: ({}),
    loading: false,
  }),

  mounted() {
    this.setDefault();
  },

  methods: {

    setDefault() {
      if (this.activeCustomer) {
        this.customer = ({...this.activeCustomer});
      }
    },

    put() {
      this.loading = true;
      putCustomer(this.customer)
          .then(response => {
            console.log('Заказчик успешно изменен', response);
            this.returnNewCustomer(response?.data);
            this.requestCompleteEvent('teal-accent-3', 'Заказчик успешно добавлен');
          })
          .catch(err => {
            console.log('Не удалось изменить заказчика', err);
            this.requestCompleteEvent('red-accent-3', 'Ошибка добавления заказчика');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    clear() {
      customerConfig.fields.forEach(f => this.customer[f.key] = '');
    }

  },

}
</script>