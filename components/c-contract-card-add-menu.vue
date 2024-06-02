<template>
  <v-card
      variant="flat"
      min-width="500"
      max-width="500"
      color="indigo-lighten-4"
      density="comfortable"
      rounded
  >
    <v-card-title>Новый договор</v-card-title>
    <v-card-subtitle>Заполните поля договора</v-card-subtitle>

    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="contract.contractNumber"
          hide-details="auto"
          label="Номер договора"
          clearable
      />
    </v-card-item>

    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="contract.contractDate"
          hide-details="auto"
          label="Выбрать дату заключения"
          clearable
          readonly
          @focus="datepickerMenuVisible = true"
      />
    </v-card-item>

    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="send">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="this.contract = clear()">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="datepickerMenuVisible" class="d-flex justify-center align-center">
      <c-datepicker-menu />
    </v-overlay>

  </v-card>
</template>

<script>
import {addContract} from "../utils/methods/contract-requests";

export default {
  name: "c-contract-card-menu-add",

  props: {
    returnContract: Function
  },

  data: () => ({
    datepickerMenuVisible: false,
    contract: {
      contractNumber: '',
      contractDate: '',
    }
  }),

  methods: {

    send() {
      addContract(this.contract)
          .then(response => {
            this.returnContract(response?.data);
            this.clear();
            console.log('Контракт добавлен');
          })
          .catch(err => {
            console.log('Ошибка добавления контракта', err);
          })
    },

    clear: () => ({
      contractNumber: '',
      contractDate: '',
    }),

  }
}
</script>