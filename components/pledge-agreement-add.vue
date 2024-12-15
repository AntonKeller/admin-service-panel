<template>
  <v-card
      min-width="400"
      max-width="750"
      width="100vw"
  >
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новая договор залога</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>
    <v-card-subtitle>Заполните поля</v-card-subtitle>
    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
        <my-text-field
            v-model="pledgeAgreement.number"
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
      <my-btn-clear
          text="Очистить"
          @click="clear"
      />
    </v-card-actions>
    <v-snackbar :color="snackbar.type" v-model="snackbar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackbar.msg }}
    </v-snackbar>
  </v-card>
</template>

<script>

import {addPledgeAgreement} from "@/utils/api/api_pledge-agreements";
import {showAlert} from "@/utils/functions";

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
      snackbar: {}
    }
  },

  methods: {
    async sendNewPledgeAgreement() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addPledgeAgreement(this.pledgeAgreement)
            .then(() => {
              this.$emit('add:success');
            })
            .catch(err => {
              this.snackbar = showAlert('Не удалось добавить договор залога!').error();
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