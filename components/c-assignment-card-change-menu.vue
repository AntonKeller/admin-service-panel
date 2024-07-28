<template>
  <v-sheet rounded="lg" width="700px">
    <v-card rounded="lg" density="compact">
      <v-card-title>
        Редактирование
      </v-card-title>
      <v-card-text>
        <v-form v-model="formIsValid" ref="form">
          <v-text-field
              v-model="assignment.title"
              :rules="rules.assignmentTitleField"
              label="Заголовок тех. задания"
              rounded="lg"
              variant="filled"
              density="comfortable"
              color="blue-grey-darken-3"
              prepend-inner-icon="mdi-label-variant-outline"
          />
          <v-autocomplete
              v-model="assignment.contract"
              :disabled="loadingContracts"
              :loading="loadingContracts"
              :items="contracts"
              density="comfortable"
              variant="filled"
              color="blue-grey-lighten-2"
              item-title="name"
              item-value="name"
              label="Договор"
              prepend-inner-icon="mdi-file-sign"
          >
            <template v-slot:chip="{ props, item }">
              {{ `${item?.raw?.contractNumber} / ${item?.raw?.contractDate}` }}
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  :subtitle="item?.raw?.contractDate"
                  :title="item?.raw?.contractNumber"
              />
            </template>
          </v-autocomplete>
          <v-autocomplete
              v-model="assignment.customer"
              :disabled="loadingCustomers"
              :loading="loadingCustomers"
              :items="customers"
              density="comfortable"
              variant="filled"
              color="blue-grey-lighten-2"
              item-title="name"
              item-value="name"
              label="Заказчик по договору"
              rounded="lg"
              prepend-inner-icon="mdi-account-tie-outline"
          >
            <template v-slot:chip="{ props, item }">
              {{ `${item?.raw?.shortName} / ${item?.raw?.inn}` }}
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  :subtitle="item?.raw?.email"
                  :title="`${item?.raw?.shortName} / ${item?.raw?.inn}`"
              />
            </template>
          </v-autocomplete>
          <v-textarea
              v-model="assignment.description"
              no-resize
              rows="10"
              rounded="lg"
              label="Описание"
              variant="filled"
              color="blue-grey-darken-1"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <my-btn-submit :loading="changing" text="Подтвердить" @click="sendChanges"/>
        <my-btn-clear text="Очистить" @click="clear"/>
      </v-card-actions>
    </v-card>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "@/utils/service/serverAPI";
import {fetchContracts} from "@/utils/methods/contract-requests";
import {fetchCustomers} from "@/utils/methods/customer-requests";
import {requestChangeAssignment} from "@/utils/methods/assignment-requests";
import {testDataContracts} from "@/configs/data-test/data-test-contracts";
import testDataCustomers from "@/configs/data-test/data-test-customers";

export default {
  name: "c-assignment-card-change-menu",

  props: {
    _assignment: Object
  },

  beforeMount() {
    this.assignment = _.cloneDeep(this._assignment);
    this.contract = _.cloneDeep(this._assignment?.contract);
    this.customer = _.cloneDeep(this._assignment?.customer);
    this.fetchContracts();
    this.fetchCustomers();
  },

  data: () => ({
    formIsValid: false,
    assignment: null,
    contract: null,
    customer: null,
    contracts: [],
    customers: [],
    changing: false,
    loadingContracts: false,
    loadingCustomers: false,
    snackBar: {},
    rules: {
      assignmentTitleField: [
        value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      ],
    }
  }),

  methods: {

    clear() {
      this.assignment = {}
    },

    async sendChanges() {

      await this.$refs.form.validate();

      if (this.formIsValid) {

        this.changing = true;

        const data = {
          assignment: {
            ...this.assignment,
            contract: this.contract,
            customer: this.customer,
          }
        }

        requestChangeAssignment(data)
            .then(() => {
              this.snackBar = showAlert('Изменено успешно!').success();
              this.$emit('update:success');
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось изменить!').error();
              this.$emit('update:error');
            })
            .finally(() => {
              this.changing = false;
            })
      }
    },

    fetchContracts() {
      this.loadingContracts = true;
      fetchContracts()
          .then(response => {
            this.contracts = response?.data?.reverse();
          })
          .catch(err => {
            this.contracts = testDataContracts;
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.loadingContracts = false;
          })
    },

    fetchCustomers() {
      this.loadingCustomers = true;
      fetchCustomers()
          .then(data => {
            this.customers = data;
          })
          .catch(err => {
            this.customers = testDataCustomers;
            console.log('Ошибка получения заказчиков/организаций\n', err);
          })
          .finally(() => {
            this.loadingCustomers = false;
          })
    },

  }
}
</script>