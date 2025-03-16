<template>
  <v-card elevation="6" width="100vw" max-width="900">
    <v-card-title class="d-flex align-center">
      Новый кредитный договор
      <v-btn
          density="comfortable"
          class="ml-auto"
          variant="text"
          size="small"
          icon=""
          @click="$emit('click:close')"
      >
        <v-icon icon="mdi-close"/>
        <v-tooltip activator="parent">Закрыть окно</v-tooltip>
      </v-btn>
    </v-card-title>
    <v-card-subtitle>Заполните поля</v-card-subtitle>
    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
        <v-text-field
            v-model="loanAgreement.number"
            v-bind="inputFieldStyle"
            label="Номер кредитного договора"
            prepend-inner-icon="mdi-label-variant-outline"
        />
        <my-date-picker v-model="loanAgreement.date"/>
      </v-form>
    </v-card-item>
    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="sendNewLoanAgreement"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addLoanAgreement} from "../utils/api/api_loan_agreements";
import {inputFieldStyle} from "@/configs/styles";

export default {
  name: "loan-agreement-add",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      loanAgreement: {
        _id: null,
        number: null,
        date: null,
      },
      formIsValid: false,

      // import styles
      inputFieldStyle,
    }
  },

  methods: {
    async sendNewLoanAgreement() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addLoanAgreement(this.loanAgreement)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Кредитный договор успешно добавлен');
              this.$emit('add:success');
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Ошибка добавления кредитного договора');
              console.log('Ошибка добавления кредитного договора', err);
            })
      }
    },
    clear() {
      this.loanAgreement = {
        _id: null,
        number: null,
        date: null,
      }
    }
  }
}
</script>