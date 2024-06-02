<template>
  <v-sheet>
    <v-card
        variant="text"
        min-width="800"
        max-width="800"
        density="comfortable"
        rounded
    >

      <v-card-title>Заказчики</v-card-title>

      <v-card-subtitle>Выберите из списка</v-card-subtitle>

      <v-card-item>
        <div class="d-flex ga-2">
          <v-btn
              rounded
              color="teal-darken-2"
              variant="elevated"
              density="default"
              size="small"
              icon="mdi-plus"
              @click="customerAddMenuVisible = true"
          />
          <v-text-field
              color="teal-darken-2"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Поиск заказчика"
              variant="outlined"
              hide-details
              single-line
              v-model="searchText"
          />
        </div>
      </v-card-item>
    </v-card>

    <v-list bg-color="transparent" max-height="360px" min-height="360px">
      <v-list-item v-if="loadingData">
        <v-skeleton-loader
            width="full"
            color="transparent"
            elevation="0"
            type="list-item-three-line"
        />
      </v-list-item>
      <v-list-item v-for="e of customersFiltered" :key="e.id">
        <c-customer-card
            :removeClick="cardRemoveClick"
            :changeClick="cardChangeClick"
            :customerProp="e"
            @click="selectCustomer({...e})"
        />
      </v-list-item>
    </v-list>

    <v-overlay
        v-model="customerAddMenuVisible"
        class="d-flex justify-center align-center"
    >
      <c-customer-card-add-menu
          :returnNewCustomer="setCustomer"
          :requestCompleteEvent = "showSnackBar"
      />
    </v-overlay>

    <v-overlay
        v-model="customerChangeMenuVisible"
        class="d-flex justify-center align-center"
    >
      <c-customer-card-change-menu
          :activeCustomer="activeChangeCustomer"
          :returnNewCustomer="setCustomer"
          :requestCompleteEvent = "showSnackBar"
      />
    </v-overlay>

    <v-snackbar :color="snackBarType" v-model="snackBarShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBarMsg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import testDataCustomers from "../configs/data-test/data-test-customers";
import {fetchCustomers} from "../utils/methods/customer-requests";

export default {
  name: "c-customers-menu",

  props: {
    selectCustomer: Function,
  },

  data: () => ({
    loadingData: true,
    activeChangeCustomer: ({}),
    customerAddMenuVisible: false,
    customerChangeMenuVisible: false,
    searchText: null,
    customerList: null,
    //------------------
    snackBarShow: false,
    snackBarType: '',
    snackBarMsg: '',
  }),

  mounted() {
    this.fetchData();
  },

  computed: {
    customersFiltered() {
      if (this.customerList?.length > 0 && this.searchText !== null) {

        let expression = new RegExp(this.searchText, "ig");

        return this.customerList.filter(customer => {
          return expression.test(customer.fullName) ||
              expression.test(customer.inn) ||
              expression.test(customer.email) ||
              expression.test(customer.address);
        })
      } else {
        return this.customerList;
      }
    },
  },

  methods: {

    showSnackBar(type, msg) {
      this.snackBarType = type;
      this.snackBarMsg = msg;
      this.snackBarShow = true;
    },

    cardRemoveClick(id) {
      this.customerList = this.customerList.filter(customer => customer._id !== id);
    },

    cardChangeClick(_customer) {
      this.activeChangeCustomer = ({..._customer});
      this.customerChangeMenuVisible = true;
    },

    setCustomer(_customer, isNew) {

      _customer = {_id: 'sdfsdfgsdg', ..._customer}

      if (isNew) {
        this.customerList.unshift(_customer);
      } else {
        for (let i = 0; i < this.customerList.length; i++) {
          if (this.customerList[i]._id === _customer._id) {
            this.customerList[i] = {..._customer};
            break;
          }
        }
      }

      this.customerChangeMenuVisible = false;
      this.customerAddMenuVisible = false;
    },

    fetchData() {
      fetchCustomers(500)
          .then(response => {
            this.customerList = response?.data?.reverse();
            console.log('Запрос списка заказчиков выполнен успешно');
          })
          .catch(err => {
            this.customerList = testDataCustomers?.reverse();
            console.log('Запрос списка заказчиков выполнен с ошибкой', err);
          })
          .finally(() => {
            this.loadingData = false;
          });
    }
  }
}
</script>