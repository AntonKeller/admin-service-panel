<template>
  <v-sheet
      rounded="sm"
      color="grey-lighten-4"
  >
    <v-card
        rounded="sm"
        variant="text"
        width="700"
        color="blue-grey-darken-3"
    >

      <v-card-title>Новый договор</v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>

      <v-card-text>
        <v-form v-model="isValid" class="d-flex flex-column ga-2">
          <my-text-field
              v-model="contract.contractNumber"
              :rules="contractNumberRules"
              prepend-inner-icon="mdi-file-sign"
              label="Номер договора"
              placeholder="..../..."
          />
          <my-date-picker
              v-model="contract.contractDate"
              :rules="contractDateRules"
              prepend-inner-icon="mdi-calendar-range"
              label="Дата заключения"
              placeholder="дд:мм:гггг"
          />
          <div class="d-flex ga-2">
            <v-autocomplete
                v-model="contract.customer"
                :items="customers"
                :loading="fetchingCustomers"
                prepend-inner-icon="mdi-account-tie"
                no-data-text="нет данных"
                color="blue-grey-darken-3"
                density="comfortable"
                variant="outlined"
                label="Заказчик"
                rounded="sm"
                closable-chips
                chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    color="blue-grey-darken-3"
                    density="default"
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :text="`${item.raw?.shortName} / ${item.raw?.inn}`"
                />
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw.shortName"
                    :subtitle="item.raw.inn"
                />
              </template>
            </v-autocomplete>
            <v-btn
                rounded="sm"
                variant="tonal"
                icon="mdi-plus"
                @click="customerAddMenuShow = true"
            />
          </div>

          <div class="d-flex ga-2">
            <v-autocomplete
                v-model="contract.contractExecutor"
                :items="contractExecutors"
                :loading="fetchingContractExecutors"
                prepend-inner-icon="mdi-account-tie"
                color="blue-grey-darken-3"
                density="comfortable"
                variant="outlined"
                label="Исполнитель"
                no-data-text="нет данных"
                rounded="sm"
                closable-chips
                chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    color="blue-grey-darken-3"
                    density="default"
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :text="`${item.raw?.shortName} / ${item.raw?.inn}`"
                />
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw.shortName"
                    :subtitle="item.raw.inn"
                />
              </template>
            </v-autocomplete>
            <v-btn
                rounded="sm"
                variant="tonal"
                icon="mdi-plus"
                @click="contractExecutorMenuAddVisibility = true"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            :loading="loading"
            @click="submit"
        />
        <my-btn-clear
            text="Очистить"
            @click="clear"
        />
      </v-card-actions>

    </v-card>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

    <my-overlay v-model="contractExecutorMenuAddVisibility">
      <contract-executor-add></contract-executor-add>
    </my-overlay>

    <my-overlay v-model="customerAddMenuShow">
      <c-customer-card-add-menu @add:success="fetchCustomersAll"></c-customer-card-add-menu>
    </my-overlay>

  </v-sheet>
</template>

<script>
import {showAlert} from "../utils/functions.js";
import {fetchCustomersAll} from "../utils/api/api_customers";
import {addContract} from "../utils/api/api_contracts";
import testDataCustomers from "../configs/data-test/data-test-customers";
import {fetchContractExecutors} from "../utils/api/api_contract_executors.js";

export default {
  name: "c-contract-card-menu-add",

  data: () => ({

    isValid: null,
    loading: false,
    contract: {
      contractNumber: null,
      contractDate: null,
      customer: null,
      contractExecutor: null,
    },
    snackBar: {},
    customers: [],
    fetchingCustomers: false,
    contractExecutors: [],
    fetchingContractExecutors: false,
    customerAddMenuShow: false,
    contractExecutorMenuAddVisibility: false,

    contractNumberRules: [
      value => /^\d{4}\/\d{3}$/i.test(value) ? true : 'Неподходящий формат номера',
    ],
    contractDateRules: [
      value => /^\d{2}\.\d{2}\.\d{4}$/i.test(value) ? true : 'Неподходящий формат даты',
    ],
    customersRules: [
      value => value?.length > 0 ? true : 'Не выбран заказчика'
    ],

  }),

  mounted() {
    this.fetchCustomersAll();
  },

  methods: {

    submit() {
      if (this.isValid) {
        this.loading = true;
        addContract(this.contract)
            .then(response => {
              this.snackBar = showAlert('Добавлен новый договор!').success();
              this.$emit('add:success');
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось добавить договор!').error();
              console.log('Ошибка запроса', err);
            })
            .finally(() => {
              this.loading = false;
            })
      } else {
        this.snackBar = showAlert('Поля не заполнены!').error();
      }
    },

    fetchCustomersAll() {

      this.fetchingCustomers = true;

      fetchCustomersAll()
          .then(response => {
            this.customers = response?.data;
          })
          .catch(err => {
            this.customers = testDataCustomers;
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.fetchingCustomers = false;
          })
    },

    async fetchContractExecutors() {

      this.fetchingContractExecutors = true;

      fetchContractExecutors()
          .then(response => {
            this.contractExecutors = response.data;
          })
          .catch(err => {
            console.log('Ошибка', err);
          })
          .finally(() => {
            this.fetchingContractExecutors = false;
          })
    },

    clear() {
      this.contract = {}
    }

  }
}
</script>