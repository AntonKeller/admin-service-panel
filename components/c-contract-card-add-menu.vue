<template>
  <v-sheet width="600px">
    <v-card
        variant="text"
        density="comfortable"
        rounded="lg"
    >

      <v-card-title>Новый договор</v-card-title>

      <v-card-subtitle>Заполните поля договора</v-card-subtitle>

      <v-card-text>

        <v-form v-model="isValid" class="d-flex ga-2">
          <my-text-field
              v-model="contract.contractNumber"
              :rules="rules.contractNumber"
              style="min-width: 350px; max-width: 350px"
              label="Номер договора"
              placeholder="xxxx/xxx"
          />
          <my-date-picker
              v-model="contract.contractDate"
              :rules="rules.contractDate"
              label="Дата заключения"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <my-btn-submit text="Добавить" :loading="loading" @click="submit"/>
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
import {addContract} from "../utils/methods/contract-requests";
import {showAlert} from "@/utils/service/serverAPI.js";

export default {
  name: "c-contract-card-menu-add",

  props: {
    returnContract: Function
  },

  data: () => ({

    isValid: null,
    loading: false,
    contract: {},
    snackBar: {},

    rules: {
      contractNumber: [
        value => /^\d{4}\/\d{3}$/i.test(value) ? true : 'Неподходящий формат номера',
      ],
      contractDate: [
        value => /^\d\d\.\d\d\.\d\d\d\d$/i.test(value) ? true : 'Неподходящий формат даты',
      ],
    }

  }),

  methods: {

    submit() {
      if (this.isValid) {
        this.loading = true;
        addContract(this.contract)
            .then(response => {
              this.snackBar = showAlert('Добавлен новый договор!').success();
              this.returnContract(response?.data);
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось добавить договор!').error();
              console.log('Ошибка запроса', err);
            })
            .finally(() => {
              this.loading = false;
            })
      } else {
        console.log('Поля не заполнены')
      }
    },

    clear() {
      this.contract = {}
    }

  }
}
</script>