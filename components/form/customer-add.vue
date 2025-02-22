<template>
  <v-container fluid>
    <v-sheet>
      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="$emit('close')">
            Закрыть
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card :loading="loading" :disabled="loading" variant="flat" width="100vw" max-width="900">

        <v-card-title>Новый заказчик</v-card-title>
        <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

        <v-card-text>
          <v-form v-model="formIsValid" ref="form">
            <v-row dense>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.shortName"
                    v-bind="inputFieldStyle"
                    label="Краткое наименование"
                    :rules="[isNotEmptyRule]"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.inn"
                    v-bind="inputFieldStyle"
                    label="ИНН"
                    :rules="[isINN]"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.fullName"
                    v-bind="inputFieldStyle"
                    label="Полное наименование"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.address"
                    v-bind="inputFieldStyle"
                    label="Юридический адрес"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.actualAddress"
                    v-bind="inputFieldStyle"
                    label="Фактический адрес"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.email"
                    v-bind="inputFieldStyle"
                    label="Email"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.phoneNumber"
                    v-bind="inputFieldStyle"
                    v-mask="options"
                    label="Номер телефона"
                    placeholder="+7 (___) ___-__-__"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.representativeFullName"
                    v-bind="inputFieldStyle"
                    label="ФИО Представителя"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.representativePosition"
                    v-bind="inputFieldStyle"
                    label="Должность представителя"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <my-btn-submit text="Принять" :loading="loading" @click="addCustomer"/>
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {isINN, isNotEmptyRule} from "@/utils/validators/functions";
import {addCustomer} from "@/utils/api/api_customers";
import {vMaska} from "maska/vue"

export default {
  name: "customer-add-page",

  emits: ['add:success', 'close'],

  directives: {
    mask: vMaska
  },

  data() {
    return {

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

      customer: {
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
      },

      loading: false,
      formIsValid: false,

      // IMPORT STYLES
      inputFieldStyle,
      navigateBackBtnStyle,
    }
  },
  methods: {

    isNotEmptyRule,
    isINN,

    async addCustomer() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не заполнены обязательные поля');
        return;
      }

      this.loading = true;

      addCustomer(this.customer)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно добавлен');
            this.$emit('add:success');
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    clear() {
      this.customer = {
        _id: null,
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        email: null,
        phoneNumber: null,
        representativeFullName: null,
        representativePosition: null,
      }
    }
  },
}
</script>