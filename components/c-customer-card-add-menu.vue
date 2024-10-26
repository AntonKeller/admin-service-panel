<template>
  <v-card
      :loading="loading"
      :disabled="loading"
      variant="elevated"
      width="800"
      rounded="lg"
  >
    <v-card-title>Новый заказчик</v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text class="d-flex flex-column ga-2">
      <v-text-field
          v-for="field of config.fields"
          v-model="customer[field.key]"
          :rules="[v => v?.length > 0 || 'Введите']"
          :key="field.key"
          :label="field.ru"
          density="comfortable"
          hide-details="auto"
          variant="outlined"
          rounded="lg"
          clearable
      />
    </v-card-text>

    <v-card-actions>
      <my-btn-submit
          text="Принять"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="sending"
          @click="send"
      />
      <my-btn-clear text="Очистить" @click="customer = {}"/>
    </v-card-actions>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-card>
</template>

<script>
import customerConfig from "../configs/customer-config";
import {addCustomer} from "../utils/api/api_customers";
import {showAlert} from "../utils/functions";

export default {
  name: "c-customer-card-add-menu",

  props: {
    returnNewCustomer: Function,
  },

  data: () => ({
    config: customerConfig,
    snackBar: {},
    customer: {},
    loading: false,
    sending: false,
  }),

  methods: {
    send() {
      this.loading = true;
      this.sending = true;
      addCustomer(this.customer)
          .then(() => {
            this.$emit('update:success');
            // this.returnNewCustomer(response?.data);
            this.snackBar = showAlert('Успешно').success();
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.snackBar = showAlert('Ошибка').error();
          })
          .finally(() => {
            this.loading = false;
            this.sending = false;
          })
    },
  },
}
</script>