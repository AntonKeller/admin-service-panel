<template>
  <v-card
      variant="flat"
      min-width="500"
      max-width="500"
      color="indigo-lighten-4"
      density="comfortable"
      rounded
  >
    <v-card-title>Редактор договора</v-card-title>
    <v-card-subtitle>Скорректируйте реквизиты договора</v-card-subtitle>

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

<!--    <v-card-item>-->
<!--      <div class="d-flex ga-2">-->
<!--        <v-text-field-->
<!--            density="comfortable"-->
<!--            v-model="contract.customer.shortName"-->
<!--            hide-details="auto"-->
<!--            label="Выбрать заказчика"-->
<!--            readonly-->
<!--            @focus="customersMenuVisible = true"-->
<!--        />-->
<!--      </div>-->
<!--    </v-card-item>-->

    <v-card-actions>
      <v-btn rounded="sm" variant="tonal" @click="send">Изменить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>

    <v-overlay v-model="datepickerMenuVisible" class="d-flex justify-center align-center">
      <c-datepicker-menu/>
    </v-overlay>

  </v-card>
</template>

<script>
import {changeContract} from "../utils/methods/contract-requests";

export default {
  name: "c-contract-card-menu-add",

  props: {
    returnContract: Function,
    _contract: Object,
  },

  data: () => ({
    // customersMenuVisible: false,
    datepickerMenuVisible: false,
    contract: {
      _id: '',
      contractNumber: '',
      contractDate: '',
    }
  }),

  mounted() {
    this.setDefault();
  },

  methods: {

    setDefault() {
      if (this._contract) {
        this.contract = ({...this._contract});
      }
    },

    // setCustomer(newCustomer) {
    //   this.contract.customer = ({...newCustomer});
    //   this.customersMenuVisible = false;
    // },

    send() {
      changeContract(this.contract)
          .then(response => {
            console.log('Договор успешно изменен', response);
            this.returnContract(response?.data);
          })
          .catch(err => {
            console.log('Ошибка при добавлении контракта', err);
          });
    },

    clear() {
      this.contract = {
        _id: this._contract._id,
        contractNumber: '',
        contractDate: '',
        // customer: {
        //   _id: '',
        //   shortName: '',
        //   fullName: '',
        //   inn: '',
        //   phoneNumber: '',
        //   email: '',
        //   address: '',
        // }
      }
    }
  }
}
</script>