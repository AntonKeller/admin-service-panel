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
          v-model="assignmentEx.title"
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
          v-model="assignmentEx.description"
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
            v-model="assignmentEx.contract.contractNumber"
            hide-details="auto"
            label="Договор"
        />
        <v-btn
            icon="mdi-plus-box-multiple-outline"
            rounded="sm"
            variant="text"
            @click="overlays.contractListVisible = true"
        />
      </div>
    </v-card-item>

    <v-card-item>
      <div class="d-flex ga-2">
        <v-text-field
            disabled
            density="compact"
            v-model="assignmentEx.customer.fullName"
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

    <v-overlay v-model="overlays.contractListVisible" class="d-flex justify-center align-center">
      <c-contract-list :selectContract="selectContract"/>
    </v-overlay>

    <v-overlay v-model="overlays.customerListVisible" class="d-flex justify-center align-center">

    </v-overlay>

  </v-card>
</template>

<script>
import {changeAssignmentEx} from "../utils/methods/assignment-requests";

export default {
  name: "c-assignment-card-add",

  props: {
    assignmentProp: Object,
    hideSelfFunc: Function,
  },

  data: () => ({

    overlays: {
      contractListVisible: false,
      customerListVisible: false,
    },

    assignmentEx: {
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

  mounted() {
    this.setDefault();
  },

  methods: {

    selectContract(newContract) {
      this.assignmentEx.contract = ({...newContract});
      this.overlays.contractListVisible = false;
    },

    selectCustomer(newCustomer) {
      this.assignmentEx.customer = ({...newCustomer});
      this.overlays.customerListVisible = false;
    },

    setDefault() {
      if (this.assignmentProp) {
        this.assignmentEx = ({...this.assignmentProp});
      }
    },

    change() {
      changeAssignmentEx(this.assignmentEx, 100)
          .then(response => {
            console.log('Запрос на изменение завершен успешно');
          })
          .catch(err => {
            console.log('Ошибка запроса на изменение задания', err);
          })
          .finally(() => {
            console.log('Запрос на изменение задания завершен');
            this.clear();
            this.hideSelfFunc();
          })
    },

    clear() {
      this.assignmentEx = {
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

<style scoped>

</style>