<template>
  <v-card
      min-width="400"
      max-width="750"
      width="100vw"
  >

    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новая задача</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Заполните поля</v-card-subtitle>

    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">

        <my-text-field
            v-model="assignment.title"
            label="Заголовок задания"
            prepend-inner-icon="mdi-label-variant-outline"
        />

        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="assignment.contract"
              :items="contracts"
              no-data-text="нет данных"
              prepend-inner-icon="mdi-file-sign"
              color="yellow-darken-3"
              density="compact"
              variant="outlined"
              label="Договор"
              closable-chips
              single-line
              chips
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  color="blue-grey-darken-3"
                  density="comfortable"
                  label
                  :text="`${item.raw?.contractNumber} / ${item.raw?.customer?.shortName}`"
              />
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  :title="item.raw?.contractNumber"
                  :subtitle="item.raw?.contractDate  + ' / ' + item.raw?.customer?.shortName"
              />
            </template>
          </v-autocomplete>

          <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              rounded="lg"
              @click="contractMenuAddShow = true"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Добавить новый договор
            </v-tooltip>
          </v-btn>
        </div>

        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="assignment.customer"
              :items="customers"
              :loading="customersFetching"
              :rules="customerRules"
              prepend-inner-icon="mdi-account-tie"
              no-data-text="нет данных"
              color="yellow-darken-3"
              variant="outlined"
              density="compact"
              label="Заказчик"
              closable-chips
              chips
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  :text="`${item.raw?.shortName} / ${item.raw?.inn}`"
                  prepend-icon="mdi-file-document-edit"
                  color="blue-grey-darken-3"
                  density="comfortable"
                  label
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
              icon="mdi-plus"
              variant="text"
              rounded="lg"
              size="small"
              @click="customerAddMenuVisible = true"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Добавить заказчика
            </v-tooltip>
          </v-btn>
        </div>

      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="sendAssignment"
      />
      <my-btn-clear
          text="Очистить"
          @click="assignment = {}"
      />
    </v-card-actions>

    <v-snackbar :color="getAlert.type" v-model="getAlert.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ getAlert.msg }}
    </v-snackbar>


    <v-overlay v-model="contractMenuAddShow" class="d-flex justify-center align-center">
      <contract-add @add:success="onContractAddSuccess" @click:close="contractMenuAddShow = false"></contract-add>
    </v-overlay>

    <my-overlay v-model="customerAddMenuVisible">
      <customer-add @add:success="onCustomerAddSuccess" @click:close="customerAddMenuVisible=false"></customer-add>
    </my-overlay>

  </v-card>
</template>

<script>
import {addNewAssignment} from "../utils/api/api_assignments.js";
import {fetchCustomersAll} from "../utils/api/api_customers";

export default {
  name: "assignment-add",

  data() {
    return {
      assignment: {
        title: null,
        contract: null,
        customer: null,
      },
      formIsValid: false,
      contractMenuAddShow: false,
      customers: [],
      customersFetching: false,
      customerAddMenuVisible: false,
      customerRules: [v => v || 'Не выбран заказчик'],
      assignmentTitleRules: [v => v?.length <= 50 || 'Кол-во символов должно быть <= 30'],
    }
  },

  beforeMount() {
    this.$store.dispatch('contracts/UPDATE_ITEMS');
    this.fetchCustomers();
  },

  computed: {
    contracts() {
      return this.$store.getters['contracts/GET_ITEMS'];
    },
    getAlert() {
      return this.$store.getters['assignments/ALERT'];
    }
  },

  methods: {

    contractsStoreUpdate() {
      this.$store.dispatch('contracts/UPDATE_ITEMS');
    },

    onCustomerAddSuccess() {
      this.customerAddMenuVisible = false;
      this.fetchCustomers();
    },

    onContractAddSuccess() {
      this.contractMenuAddShow = false;
      this.contractsStoreUpdate();
    },

    async sendAssignment() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addNewAssignment(this.assignment)
            .then(() => {
              this.$store.dispatch('assignments/FETCH');
              this.$emit('add:success');
            })
            .catch((err) => {
              console.log('Ошибка добавления задачи', err)
            })
      }
    },

    fetchCustomers() {

      this.customersFetching = true;

      fetchCustomersAll()
          .then(response => {
            this.customers = response?.data;
          })
          .catch(err => {
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.customersFetching = false;
          })
    },

  }
}
</script>

<!--<style>-->
<!--@font-face {-->
<!--  font-family: 'TildaSans-Regular';-->
<!--  src: url('~assets/fonts/TildaSans-Regular.ttf') format('opentype'),-->
<!--}-->
<!--</style>-->