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

        <v-combobox
            @update:modelValue="e => contractUpdateValue(e)"
            :model-value="testField.contractNumber"
            :custom-filter="contractFilter"
            :items="contracts"
            label="Номер договора"
            color="yellow-darken-3"
            variant="outlined"
            density="compact"
        >
          <template #chip="{ props, item }">
            <v-chip
                v-bind="props"
                prepend-icon="mdi-file-document-edit"
                color="blue-grey-darken-3"
                density="comfortable"
                label
                :text="item.raw"
            />
          </template>

          <template #item="{ props, item }">
            <v-list-item
                v-bind="props"
                prepend-icon="mdi-file-document-edit"
                :title="item.raw.contractNumber || 'отсутствует номер'"
                :subtitle="unixDateToLongDateString(item.raw?.contractDate)"
            />
          </template>
        </v-combobox>

        <div class="pl-8">
          <my-date-picker
              v-model="testField.contractDate"
              label="Дата договора"
          />
        </div>

<!--        <div class="d-flex ga-1">-->
<!--          <v-autocomplete-->
<!--              v-model="assignment.contract"-->
<!--              :items="contracts"-->
<!--              prepend-inner-icon="mdi-file-sign"-->
<!--              no-data-text="нет данных"-->
<!--              color="yellow-darken-3"-->
<!--              variant="outlined"-->
<!--              density="compact"-->
<!--              label="Договор"-->
<!--              closable-chips-->
<!--              chips-->
<!--          >-->
<!--            <template v-slot:chip="{ props, item }">-->
<!--              <v-chip-->
<!--                  v-bind="props"-->
<!--                  prepend-icon="mdi-file-document-edit"-->
<!--                  color="blue-grey-darken-3"-->
<!--                  density="comfortable"-->
<!--                  label-->
<!--                  :text="`${item.raw?.contractNumber} / ${item.raw?.customer?.shortName}`"-->
<!--              />-->
<!--            </template>-->

<!--            <template v-slot:item="{ props, item }">-->
<!--              <v-list-item-->
<!--                  v-bind="props"-->
<!--                  prepend-icon="mdi-file-document-edit"-->
<!--                  :title="item.raw?.contractNumber"-->
<!--                  :subtitle="item.raw?.contractDate  + ' / ' + item.raw?.customer?.shortName"-->
<!--              />-->
<!--            </template>-->
<!--          </v-autocomplete>-->
<!--          <v-btn-->
<!--              icon="mdi-plus"-->
<!--              variant="text"-->
<!--              size="small"-->
<!--              rounded="lg"-->
<!--              @click="contractMenuAddShow = true"-->
<!--          >-->
<!--            <v-icon/>-->
<!--            <v-tooltip activator="parent" location="left">-->
<!--              Добавить новый договор-->
<!--            </v-tooltip>-->
<!--          </v-btn>-->
<!--        </div>-->

        <my-text-field
            v-model="assignment.termsOfReference"
            label="№ ТЗ к договору"
            prepend-inner-icon="mdi-label-variant-outline"
        />

        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="assignment.loanAgreement"
              :items="loanAgreements"
              prepend-inner-icon="mdi-file-sign"
              no-data-text="нет данных"
              color="yellow-darken-3"
              density="compact"
              variant="outlined"
              label="Кредитный договор"
              closable-chips
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
              @click="loanAgreementMenuAddShow = true"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Добавить новый кредитный договор
            </v-tooltip>
          </v-btn>
        </div>

        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="assignment.pledgeAgreement"
              :items="pledgeAgreements"
              prepend-inner-icon="mdi-file-sign"
              no-data-text="нет данных"
              color="yellow-darken-3"
              density="compact"
              variant="outlined"
              label="Договор залога"
              closable-chips
              chips
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  color="blue-grey-darken-3"
                  density="comfortable"
                  label
                  :text="`${item.raw?.pledgeAgreementNum} / ${item.raw?.pledger}`"
              />
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  :title="item.raw?.pledgeAgreementNum"
                  :subtitle="item.raw?.pledgeAgreementDate  + ' / ' + item.raw?.pledger"
              />
            </template>
          </v-autocomplete>
          <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              rounded="lg"
              @click="pledgeAgreementMenuAddShow = true"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Добавить новый договор залога
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
          @click="clear"
      />
    </v-card-actions>

    <v-snackbar :color="getAlert.type" v-model="getAlert.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ getAlert.msg }}
    </v-snackbar>

    <!--  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  -->
    <!--  ~~~~~~~~~~~~~~~~~~~~~~~Всплывающие окна~~~~~~~~~~~~~~~~~~~~~~~  -->
    <!--  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~  -->

    <v-overlay v-model="contractMenuAddShow" class="d-flex justify-center align-center">
      <contract-add @add:success="onContractAddSuccess" @click:close="contractMenuAddShow = false"></contract-add>
    </v-overlay>

    <my-overlay v-model="customerAddMenuVisible">
      <customer-add @add:success="onCustomerAddSuccess" @click:close="customerAddMenuVisible=false"></customer-add>
    </my-overlay>

    <!--    TODO: добавить меню добавления кредитного договора-->
    <v-overlay v-model="loanAgreementMenuAddShow" class="d-flex justify-center align-center">

    </v-overlay>

    <!--    TODO: добавить меню добавления договора залога-->
    <v-overlay v-model="pledgeAgreementMenuAddShow" class="d-flex justify-center align-center">

    </v-overlay>

  </v-card>
</template>

<script>
import {addNewAssignment} from "../utils/api/api_assignments.js";
import {fetchCustomersAll} from "../utils/api/api_customers";
import {unixDateToLongDateString} from "../utils/functions.js";
import MyDatePicker from "./my-date-picker.vue";
import object from "../pages/manager-menu/assignments/assignment-card/block/object.vue";
import _ from "lodash";

export default {
  name: "assignment-add",
  components: {MyDatePicker},
  data() {
    return {

      testField: {
        contractNumber: null,
        contractDate: null,
      },

      contractTest: null,

      assignment: {
        title: null, // Заголовок задачи
        customer: null, // Заказчик
        contract: null, // Договор
        termsOfReference: null, // № Технического задания
        loanAgreement: null, // Кредитный договор
        pledgeAgreement: null, // Договор залога
      },
      formIsValid: false,
      contractMenuAddShow: false,

      customers: [],
      customersFetching: false,
      customerAddMenuVisible: false,
      customerRules: [v => v || 'Заказчик должен быть выбран'],

      loanAgreements: [],
      loanAgreementsFetching: false,
      loanAgreementMenuAddShow: false,
      loanAgreementRules: [v => v || 'Договор должен быть выбран'],

      pledgeAgreements: [],
      pledgeAgreementsFetching: false,
      pledgeAgreementMenuAddShow: false,
      pledgeAgreementRules: [v => v || 'Договор должен быть выбран'],

      assignmentTitleRules: [v => v && v?.length <= 50 || 'Кол-во символов должно быть <= 50'],
    }
  },

  beforeMount() {
    this.$store.dispatch('contracts/UPDATE_ITEMS');
    this.fetchCustomers();
  },

  watch: {
    testField: {
      handler(newVal, oldVal) {
        console.log('testField:\n', this.testField);
      },
      deep: true,
    }
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

    unixDateToLongDateString,

    contractFilter(any, search, item) {
      return (new RegExp(search, 'ig')).test(item.raw?.contractNumber);
    },

    contractUpdateValue(value) {

      // type = string
      if (!value || typeof value === 'string') {
        this.testField.contractNumber = value;
        this.testField.contractDate = null;
        return;
      }

      // type = object
      if (typeof value === 'object') {
        this.testField.contractNumber = value.contractNumber;
        this.testField.contractDate = value.contractDate;
      }
    },

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

    async fetchLoanAgreements() {
      this.loanAgreementsFetching = true;
      // TODO: дописать запрос
    },

    async fetchPledgeAgreements() {
      this.pledgeAgreementsFetching = true;
      // TODO: дописать запрос
    },

    clear() {
      this.assignment = {
        title: null,
        contract: null,
        customer: null,
      }
    }

  }
}
</script>