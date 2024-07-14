<template>
  <v-sheet>
    <v-card
        variant="text"
        min-width="500"
        max-width="500"
        color="teal-darken-4"
        density="comfortable"
        rounded
    >
      <v-card-title>Новый договор</v-card-title>
      <v-card-subtitle>Заполните поля договора</v-card-subtitle>

      <v-card-item>
        <v-text-field
            variant="underlined"
            v-model="contract.contractNumber"
            hide-details="auto"
            label="Номер договора"
            clearable
        />
      </v-card-item>

      <v-card-item>
        <v-text-field
            variant="underlined"
            v-model="contract.contractDate"
            hide-details="auto"
            label="Выбрать дату заключения"
            clearable
            readonly
            @focus="datepickerMenuVisible = true"
        />
      </v-card-item>

      <v-card-actions>
        <v-btn
            @click="send"
            rounded="sm"
            variant="outlined"
        >
          Добавить
        </v-btn>
        <v-btn
            @click="this.contract = clear()"
            rounded="sm"
            variant="outlined"
        >
          Очистить
        </v-btn>
      </v-card-actions>

      <v-overlay v-model="datepickerMenuVisible" class="d-flex justify-center align-center">
        <c-datepicker-menu/>
      </v-overlay>

    </v-card>
  </v-sheet>
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