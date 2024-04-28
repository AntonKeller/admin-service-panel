<template>
  <v-card
      density="compact"
      rounded
      variant="elevated"
      min-width="480"
      color="indigo-lighten-4">

    <v-card-title>Редактор ТЗ</v-card-title>

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
      <v-textarea
          style="max-height: 350px"
          maxlength="250"
          density="compact"
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

    <v-card-item>
      <div class="d-flex ga-2">
        <v-text-field
            disabled
            density="compact"
            v-model="assignment.contract.customer.fullName"
            hide-details="auto"
            label="Заказчик"
        />
        <v-btn
            icon="mdi-plus-box-multiple-outline"
            rounded="sm"
            variant="text"
            @click="console.log('Выбрать')"
        />
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="change">Изменить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="contractsMenuVisible" class="d-flex justify-center align-center">
      <c-contracts-menu :selectContract="selectContract"/>
    </v-overlay>

  </v-card>
</template>

<script>
import {changeAssignment} from "../utils/methods/assignment-requests";

export default {
  name: "c-assignment-card-change-menu",

  props: {
    assignmentProp: Object,
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
        customer: {
          _id: '',
          shortName: '',
          fullName: '',
          inn: '',
          phoneNumber: '',
          email: '',
          address: '',
        }
      },
    },

  }),

  mounted() {
    this.setDefault();
  },

  methods: {

    selectContract(newContract) {
      this.assignment.contract = ({...newContract});
      this.contractsMenuVisible = false;
    },

    setDefault() {
      if (this.assignmentProp) {
        this.assignment = ({...this.assignmentProp});
      }
    },

    change() {
      changeAssignment(this.assignment, 100)
          .then(response => {
            console.log('Запрос на изменение завершен успешно');
          })
          .catch(err => {
            console.log('Ошибка запроса на изменение задания', err);
          })
          .finally(() => {
            console.log('Запрос на изменение задания завершен');
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
          customer: {
            _id: '',
            shortName: '',
            fullName: '',
            inn: '',
            phoneNumber: '',
            email: '',
            address: '',
          }
        },
      }
    }

  },

}
</script>

<style scoped>

</style>