<template>
  <v-card
      min-width="400"
      max-width="750"
      width="100vw"
  >
    <v-card-title class="d-flex align-center">
      Новый договор залога
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
            v-model="pledgeAgreement.number"
            v-bind="inputFieldStyle"
            label="Номер договора залога"
            prepend-inner-icon="mdi-label-variant-outline"
        />
        <my-date-picker v-model="pledgeAgreement.date"/>
      </v-form>
    </v-card-item>
    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="sendNewPledgeAgreement"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>

import {addPledgeAgreement} from "@/utils/api/api_pledge-agreements";
import {inputFieldStyle} from "@/configs/styles";

export default {
  name: "pledge-agreement-add",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      pledgeAgreement: {
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
    async sendNewPledgeAgreement() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addPledgeAgreement(this.pledgeAgreement)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Договор залога успешно добавлен');
              this.$emit('add:success');
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Ошибка добавления договора залога');
              console.log('Ошибка добавления договора залога', err);
            })
      }
    },
    clear() {
      this.pledgeAgreement = {
        _id: null,
        number: null,
        date: null,
      }
    }
  }
}
</script>