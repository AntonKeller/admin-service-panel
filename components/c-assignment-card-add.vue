<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Новое задание</v-card-title>
    <v-card-subtitle>Введите информацию о задаче</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.title"
          hide-details="auto"
          label="Заголовок задания"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.description"
          hide-details="auto"
          label="Описание"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.contract.contractNumber"
          hide-details="auto"
          label="Номер договора"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.contract.contractDate"
          hide-details="auto"
          label="Дата заключения договора"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.customer.fullName"
          hide-details="auto"
          label="Заказчик"
          clearable
      />
    </v-card-item>
    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="add">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addAssignmentEx} from '../utils/methods/assignment-requests';

export default {
  name: "c-assignment-card-add",

  props: {
    hideSelfFunc: Function,
  },

  data: () => ({
    assignment: {
      title: '',
      description: '',
      contract: {
        contractNumber: '',
        contractDate: '',
      },
      customer: {
        shortName: '',
        fullName: '',
        inn: '',
        phoneNumber: '',
        email: '',
        address: '',
      },
    },
  }),

  methods: {

    add() {
      addAssignmentEx(this.assignment, 100)
          .then(response => {
            console.log('Запрос на добавление завершен успешно');
          })
          .catch(err => {
            console.log('Ошибка запроса на добавление задания', err);
          })
          .finally(() => {
            console.log('Запрос на добавление задания завершен');
            this.clear();
            this.hideSelfFunc();
          })
    },

    clear() {
      this.assignment = {
        title: '',
        description: '',
        contract: {
          contractNumber: '',
          contractDate: '',
        },
        customer: {
          shortName: '',
          fullName: '',
          inn: '',
          phoneNumber: '',
          email: '',
          address: '',
        },
      }
    }

  },

}
</script>