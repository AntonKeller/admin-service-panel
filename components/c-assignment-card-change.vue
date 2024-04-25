<template>
  <v-card
      density="compact"
      rounded
      variant="elevated"
      min-width="480"
      color="indigo-lighten-4">

    <v-card-title>Новое задание</v-card-title>

    <v-card-subtitle>Введите информацию о задаче</v-card-subtitle>

    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignmentExtend.title"
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
          v-model="assignmentExtend.description"
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
            v-model="assignmentExtend.contract.contractNumber"
            hide-details="auto"
            label="Договор"
        />
        <v-btn
            icon="mdi-plus-box-multiple-outline"
            rounded="sm"
            variant="text"
            @click="contractsOverlay = true"
        />
      </div>
    </v-card-item>

    <v-card-item>
      <div class="d-flex ga-2">
        <v-text-field
            disabled
            density="compact"
            v-model="assignmentExtend.customer.fullName"
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
      <v-btn rounded="sm" variant="tonal" @click="add">Изменить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="contractsOverlay" class="d-flex justify-center align-center">
      <v-card
          variant="flat"
          min-width="480"
          color="indigo-lighten-4"
          density="comfortable"
          rounded
      >
        <v-card-title>Договоры</v-card-title>
        <v-card-subtitle>Выберите или создайте новый</v-card-subtitle>
        <v-card-text>
          <v-list bg-color="transparent" max-height="360px">
            <v-list-item v-for="e of testDataContracts">
              <c-contract-card @click="console.log('')" :contract="e"/>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn rounded="sm" variant="tonal" @click="add">Изменить</v-btn>
          <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
  </v-card>
</template>

<script>
import {putAssignment} from '../utils/methods/requests';
import {testDataContracts} from "@/configs/testData";

export default {
  name: "c-assignment-card-add",

  props: {
    assignmentProp: Object,
    hideSelfFunc: Function,
  },

  data: () => ({

    contractsOverlay: false,
    testDataContracts,

    assignmentExtend: {
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

    setContract(newContract) {
      this.assignmentExtend.contract = ({...newContract});
    },

    setCustomer(newCustomer) {
      this.assignmentExtend.customer = ({...newCustomer});
    },

    setDefault() {
      console.log('this.assignmentProp', this.assignmentProp)
      if (this.assignmentProp) {
        this.assignmentExtend = ({...this.assignmentProp});
      }
    },

    add() {
      putAssignment(this.assignmentExtend, 100)
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
      this.assignmentExtend = {
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