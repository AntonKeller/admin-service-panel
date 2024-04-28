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
      <div class="d-flex ga-2">
        <v-text-field
            disabled
            density="compact"
            v-model="assignment.contract.contractNumber"
            hide-details="auto"
            label="Договор"
        />
        <v-btn
            icon="mdi-plus-box-multiple-outline"
            rounded="sm"
            variant="text"
            @click="contractsMenuVisible = true"
        />
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="add">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="contractsMenuVisible" class="d-flex justify-center align-center">
      <c-contracts-menu :selectContract="setContract"/>
    </v-overlay>

  </v-card>
</template>

<script>
import {addAssignment} from '../utils/methods/assignment-requests';

export default {
  name: "c-assignment-card-add-menu",

  props: {
    hideMenu: Function,
  },

  data: () => ({
    contractsMenuVisible: false,
    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: {
        _id: '',
        contractNumber: '',
        contractDate: '',
      },
    },
  }),

  methods: {

    setContract(newContract) {
      this.assignment.contract = {...newContract}
      this.contractsMenuVisible = false;
      console.log('select contract:', this.assignment.contract)
    },

    add() {

      let data = {
        title: this.assignment.title,
        description: this.assignment.description,
        contractId: this.assignment.contract._id,
      };

      console.log('data', data)

      addAssignment(data, 0)
          .then(response => {
            console.log('Запрос на добавление завершен успешно', response);
          })
          .catch(err => {
            console.log('Ошибка запроса на добавление задания', err);
          })
          .finally(() => {
            console.log('Запрос на добавление задания завершен');
            this.clear();
            this.hideMenu();
          })
    },

    clear() {
      this.assignment = {
        _id: '',
        title: '',
        description: '',
        contract: {
          _id: '',
          contractNumber: '',
          contractDate: '',
        },
      }
    }

  },

}
</script>