<template>
  <v-sheet
      rounded="lg"
      elevation="6"
      color="grey-lighten-4"
  >
    <v-card
        rounded="lg"
        variant="text"
        width="600px"
        color="blue-grey-darken-3"
    >

      <v-card-title>Новый договор</v-card-title>

      <v-card-subtitle>Заполните поля договора</v-card-subtitle>

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
                v-model="cCustomer"
                :items="customers"
                :rules="customersRules"
                prepend-inner-icon="mdi-account-tie"
                color="blue-grey-darken-3"
                density="comfortable"
                variant="outlined"
                label="Заказчик"
                rounded="lg"
                item-value="_id"
                item-title="fullName"
                closable-chips
                chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    color="blue-grey-darken-3"
                    density="comfortable"
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
                rounded="lg"
                variant="tonal"
                icon="mdi-plus"
                @click="customerAddMenuShow = true"
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


    <my-overlay v-model="customerAddMenuShow">
      <c-customer-card-add-menu @add:success="fetchCustomersAll"/>
    </my-overlay>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "../utils/functions.js";
import {fetchCustomersAll} from "../utils/api/api_customers";
import {addContract} from "../utils/api/api_contracts";
import testDataCustomers from "../configs/data-test/data-test-customers";

export default {
  name: "c-contract-card-menu-add",

  data: () => ({

    isValid: null,
    loading: false,
    contract: {},
    snackBar: {},
    customers: [],
    customerAddMenuShow: false,

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

  computed: {

    cCustomer: {
      set(_id) {
        this.contract.customer = _id ? _.cloneDeep(this.customers.find(e => e._id === _id)) : null;
      },
      get() {
        return this.contract.customer?._id;
      },
    },
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

    clear() {
      this.contract = {}
    }

  }
}
</script>