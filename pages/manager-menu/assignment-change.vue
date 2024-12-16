<template>
  <v-container fluid>
    <v-card
        variant="text"
        min-width="400"
        max-width="1024"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>Редактор задания</div>
          <v-btn
              density="comfortable"
              color="blue-grey-darken-2"
              icon="mdi-arrow-left"
              variant="text"
              rounded="lg"
              @click="goBack"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Назад
            </v-tooltip>
          </v-btn>
        </div>
      </v-card-title>

      <v-card-subtitle>Заполните поля</v-card-subtitle>

      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">

          <my-text-field
              v-model="assignment.title"
              :rules="assignmentTitleRules"
              label="Заголовок задания"
              prepend-inner-icon="mdi-label-variant-outline"
          />

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="assignment.customer"
                :loading="customersFetching"
                :items="customersList"
                :custom-filter="customerSearchFilter"
                prepend-inner-icon="mdi-account-tie"
                no-data-text="нет данных"
                color="yellow-darken-3"
                variant="outlined"
                density="compact"
                label="Заказчик"
                hide-selected
                closable-chips
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    :text="`${item.raw?.shortName} / ${item.raw?.inn}`"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw.shortName"
                    :subtitle="item.raw.inn"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="console.log('Удален')"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-btn
                icon="mdi-plus"
                variant="text"
                rounded="lg"
                size="small"
                @click="customerMenuAddVisible = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Добавить нового заказчика
              </v-tooltip>
            </v-btn>
          </div>

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="assignment.contract"
                :loading="contractsFetching"
                :items="contracts"
                :custom-filter="contractSearchFilter"
                prepend-inner-icon="mdi-file-document-edit"
                no-data-text="нет данных"
                color="yellow-darken-3"
                variant="outlined"
                density="compact"
                label="Договор"
                closable-chips
                hide-selected
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw?.number"
                    :subtitle="unixDateToLongDateString(item.raw?.date)"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="removeContract(item.raw._id)"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-btn
                icon="mdi-plus"
                variant="text"
                rounded="lg"
                size="small"
                @click="contractMenuAddVisible = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Добавить новый договор
              </v-tooltip>
            </v-btn>
          </div>

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="assignment.subContract"
                :loading="subContractsFetching"
                :items="subContracts"
                :custom-filter="subContractSearchFilter"
                prepend-inner-icon="mdi-file-document-multiple-outline"
                no-data-text="нет данных"
                color="yellow-darken-3"
                variant="outlined"
                density="compact"
                label="Техническое задание к договору"
                closable-chips
                hide-selected
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-multiple-outline"
                    :title="item.raw?.number"
                    :subtitle="unixDateToLongDateString(item.raw?.date)"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="console.log('Удален')"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </div>

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="assignment.loanAgreements"
                :loading="loanAgreementsFetching"
                :items="loanAgreementsList"
                :custom-filter="loanAgreementSearchFilter"
                prepend-inner-icon="mdi-file-sign"
                no-data-text="нет данных"
                color="yellow-darken-3"
                density="compact"
                variant="outlined"
                label="Список кредитных договоров"
                closable-chips
                hide-selected
                multiple
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                    :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw?.contractNumber"
                    :subtitle="unixDateToLongDateString(item.raw?.date)"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="console.log('Удален')"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                rounded="lg"
                @click="loanAgreementMenuAddVisible = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Добавить новый кредитный договор
              </v-tooltip>
            </v-btn>
          </div>

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="assignment.pledgeAgreements"
                :loading="pledgeAgreementsFetching"
                :items="pledgeAgreementsList"
                :custom-filter="pledgeAgreementSearchFilter"
                prepend-inner-icon="mdi-file-sign"
                no-data-text="нет данных"
                color="yellow-darken-3"
                density="compact"
                variant="outlined"
                label="Список договоров залога"
                closable-chips
                hide-selected
                multiple
                chips
            >
              <template #chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                    label
                    :text="`${item.raw?.number} / ${unixDateToLongDateString(item.raw?.date)}`"
                />
              </template>

              <template #item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw?.number"
                    :subtitle="unixDateToLongDateString(item.raw?.date)"
                >
                  <template #append>
                    <v-btn
                        icon="mdi-progress-close"
                        color="red-darken-4"
                        density="comfortable"
                        variant="text"
                        @click.stop="console.log('Удален')"
                    >
                      <v-icon/>
                      <v-tooltip activator="parent">
                        Удалить запись
                      </v-tooltip>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
            <v-btn
                icon="mdi-plus"
                variant="text"
                size="small"
                rounded="lg"
                @click="pledgeAgreementMenuAddVisible = true"
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
            text="Подтвердить"
            :loading="changing"
            @click="sendChanges"
        />
        <my-btn-clear text="Очистить" @click="this.assignment = {}"/>
      </v-card-actions>

      <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackBar.msg }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import {fetchPledgeAgreements, removePledgeAgreement} from "../../utils/api/api_pledge-agreements";
import {fetchLoanAgreements, removeLoanAgreement} from "../../utils/api/api_loan_agreements";
import {fetchCustomers, removeCustomer} from "../../utils/api/api_customers";
import {fetchContracts, removeContract} from "../../utils/api/api_contracts";
import {changeAssignment, fetchAssignmentOneById} from "../../utils/api/api_assignments";
import {showAlert, unixDateToLongDateString} from "../../utils/functions";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignment-change-page",

  data() {
    return {
      assignment: {
        _id: null, // _id - всегда null при добавлении
        title: null, // Заголовок задачи
        customer: null, // Заказчик
        contract: null, // Договор
        subContract: null, // Техническое задание
        loanAgreements: null, // Кредитный договор
        pledgeAgreements: null, // Договор залога
      },

      formIsValid: false,
      changing: false,
      snackBar: {},

      assignmentTitleRules: [v => v && v?.length <= 50 || 'Кол-во символов должно быть <= 50'],

      contractsList: [], // TODO: Запросы и Vue вывод полей
      contractsFetching: false,
      contractMenuAddVisible: false,
      contractRules: [v => v || 'Договор должен быть выбран'],

      subContractsFetching: false, // TODO: Запросы и Vue вывод полей
      subContractMenuAddVisible: false,
      subContractRules: [v => v || 'Договор должен быть выбран'],

      customersList: [], // TODO: Запросы и Vue вывод полей
      customersFetching: false,
      customerMenuAddVisible: false,
      customerRules: [v => v || 'Заказчик должен быть выбран'],

      loanAgreementsList: [], // TODO: Запросы и Vue вывод полей
      loanAgreementsFetching: false,
      loanAgreementMenuAddVisible: false,
      loanAgreementRules: [v => v || 'Договор должен быть выбран'],

      pledgeAgreementsList: [], // TODO: Запросы и Vue вывод полей
      pledgeAgreementsFetching: false,
      pledgeAgreementMenuAddVisible: false,
      pledgeAgreementRules: [v => v || 'Договор должен быть выбран'],
    }
  },


  async beforeMount() {
    if (!this.$store.getters['assignments/SELECTED']?._id) {
      this.goBack();
    } else {
      const answer = await fetchAssignmentOneById(this.$store.getters['assignments/SELECTED']?._id);
      switch (answer.status) {
        case 200:
          console.log('[beforeMount] init selected assignment: req answer', answer)
          this.assignment = _.cloneDeep(answer.data);
          break;
        default:
          this.goBack();
          break;
      }
    }
    console.log('selected assignment', this.assignment);
  },

  async mounted() {
    await this.fetchCustomersList();
    await this.fetchContractsList();
    await this.fetchLoanAgreementsList();
    await this.fetchPledgeAgreementsList();
  },

  computed: {
    contracts() {
      return this.contractsList?.filter(contract => !contract.parent) || [];
    },
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'] || [];
    },
    subContracts() {
      return this.contractsList?.filter(contract => contract.parent) || [];
    },
  },

  methods: {

    unixDateToLongDateString,

    customerSearchFilter(value, query, item) {
      return [
        item.raw.inn || null,
        item.raw.fullName || null,
        item.raw.representativeFullName || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    contractSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    subContractSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    loanAgreementSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    pledgeAgreementSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    goBack() {
      navigateTo('/manager-menu/assignments');
    },

    async onCustomerAddSuccess() {
      this.customerMenuAddVisible = false;
      await this.fetchCustomersList();
    },

    async onContractAddSuccess() {
      this.contractMenuAddVisible = false;
      await this.fetchContractsList();
    },

    async onLoanAgreementAddSuccess() {
      this.loanAgreementMenuAddVisible = false;
      await this.fetchLoanAgreementsList();
    },

    async onPledgeAgreementAddSuccess() {
      this.pledgeAgreementMenuAddVisible = false;
      await this.fetchPledgeAgreementsList();
    },

    async sendChanges() {

      await this.$refs.form.validate();

      if (this.formIsValid) {

        this.changing = true;

        changeAssignment(this.assignment)
            .then(() => {
              this.snackBar = showAlert('Изменено успешно!').success();
              this.goBack();
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось изменить!').error();
            })
            .finally(() => {
              this.changing = false;
            })
      }
    },

    async fetchCustomersList() {
      this.customersFetching = true;
      const answer = await fetchCustomers();
      switch (answer.status) {
        case 200:
          this.customersList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о заказчиках');
          break;
      }
      this.customersFetching = false;
    },

    async fetchContractsList() {
      this.contractsFetching = true;
      const answer = await fetchContracts();
      switch (answer.status) {
        case 200:
          this.contractsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о договорах');
          break;
      }
      this.contractsFetching = false;
    },

    async fetchLoanAgreementsList() {
      this.loanAgreementsFetching = true;
      const answer = await fetchLoanAgreements();
      switch (answer.status) {
        case 200:
          this.loanAgreementsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о кредитных договорах');
          break;
      }
      this.loanAgreementsFetching = false;
    },

    async fetchPledgeAgreementsList() {
      this.pledgeAgreementsFetching = true;
      const answer = await fetchPledgeAgreements();
      switch (answer.status) {
        case 200:
          this.pledgeAgreementsList = answer.data;
          break;
        default:
          console.log('Ошибка получения данных о договорах залога');
          break;
      }
      this.pledgeAgreementsFetching = false;
    },

    removeCustomer() {
      removeCustomer()
          .then(() => {
            //   TODO: написать логику удаления
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    removeContract(id) {
      removeContract(id)
          .then(() => {
            this.fetchContractsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    removeLoanAgreement() {
      removeLoanAgreement()
          .then(() => {
            //   TODO: написать логику удаления
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

    removePledgeAgreement() {
      removePledgeAgreement()
          .then(() => {
            //   TODO: написать логику удаления
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
    },

  }
}
</script>