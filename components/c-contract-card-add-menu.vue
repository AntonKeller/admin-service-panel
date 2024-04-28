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
          label="Дата заключения"
          clearable
      />
    </v-card-item>

    <v-card-item>
      <div class="d-flex ga-2">
        <v-text-field
            disabled
            density="compact"
            v-model="contract.customer.shortName"
            hide-details="auto"
            label="Заказчик"
        />
        <v-btn
            icon="mdi-plus-box-multiple-outline"
            rounded="sm"
            variant="text"
            @click="customersMenuVisible = true"
        />
      </div>
    </v-card-item>

    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="send">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="customersMenuVisible" class="d-flex justify-center align-center">
      <c-customers-menu :returnCustomer="setCustomer"/>
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
    customersMenuVisible: false,
    contract: {
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
    }
  }),

  methods: {
    setCustomer(newCustomer) {
      this.contract.customer = ({...newCustomer});
      this.customersMenuVisible = false;
    },
    send() {
      addContract({
        contractNumber: this.contract.contractNumber,
        contractDate: this.contract.contractDate,
        customerId: this.contract.customer._id
      }, 500)
          .then(response => {
            console.log('Запроса на добавление успешно завершен');
            this.returnContract(response?.data);
          })
          .catch(err => {
            console.log('Ошибка запроса на добавление контракта');
            console.log('Вернул договор', {_id: '565145', ...this.contract})
            this.returnContract({_id: '565145', ...this.contract});
          })
          .finally(() => {
            console.log('Запрос на добавление контракта завершен');
          })
    },
    clear() {
      this.contract = {
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
      }
    }
  }
}
</script>