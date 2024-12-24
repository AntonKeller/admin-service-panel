<template>
  <div class="d-flex ga-1">
    <v-autocomplete
        v-bind="$attrs"
        :loading="loanAgreementsFetching"
        :items="loanAgreementsList"
        :custom-filter="loanAgreementSearchFilter"
        @update:menu="onUpdateMenuLoanAgreements"
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
                @click.stop="removeLoanAgreement(item.raw._id)"
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

    <v-overlay v-model="loanAgreementMenuAddVisible" class="d-flex justify-center align-center">
      <loan-agreement-add
          @add:success="onLoanAgreementAddSuccess"
          @click:close="loanAgreementMenuAddVisible=false"
      />
    </v-overlay>
  </div>
</template>

<script>
import {unixDateToLongDateString} from "../../../utils/functions.js";
import {fetchLoanAgreements, removeLoanAgreement} from "../../../utils/api/api_loan_agreements.js";

export default {
  name: "loanAgreements",
  data() {
    return {
      loanAgreementsList: [], // TODO: Запросы и Vue вывод полей
      loanAgreementsFetching: false,
      loanAgreementMenuAddVisible: false,
      loanAgreementRules: [v => v || 'Договор должен быть выбран'],
    }
  },
  methods: {

    unixDateToLongDateString,

    onLoanAgreementAddSuccess() {
      this.fetchLoanAgreementsList();
      this.loanAgreementMenuAddVisible = false;
    },

    loanAgreementSearchFilter(value, query, item) {
      return [
        item.raw.number || null,
      ].some(value => (new RegExp(query, 'ig')).test(value));
    },

    onUpdateMenuLoanAgreements(status) {
      if (status) this.fetchLoanAgreementsList();
    },

    removeLoanAgreement() {
      removeLoanAgreement()
          .then(() => {
            this.fetchLoanAgreementsList();
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
          })
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
  }
}
</script>