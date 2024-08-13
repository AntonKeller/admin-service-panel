<template>
</template>

<script>
import _ from "lodash";
import {showAlert} from "../utils/service/serverAPI";
import {fetchContractsAll, addNewAssignment} from '../utils/service/server.ts';
import {testDataContracts} from "../configs/data-test/data-test-contracts";

export default {
  name: "c-assignment-card-menu-add",
  components: {},

  data: () => ({

    // data
    assignment: {},

    // prompt data
    contracts: [],
    customers: [],

    // loaders
    sendingData: false,
    fetchingContracts: false,
    fetchingCustomers: false,

    formIsValid: false,
    snackBar: {},

    // menus
    contractAddMenuShow: false,
    customerAddMenuShow: false,

    assignmentTitleRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length <= 100 ? true : 'Кол-во символов должно быть <= 100'
    ],
    contractRules: [
      value => value?.length > 0 ? true : 'Выберите договор'
    ],
    assignmentDescriptionRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length <= 1500 ? true : 'Кол-во символов должно быть <= 1500',
    ],

  }),

  mounted() {
    this.fetchContractsAll();
  },

  computed: {

    cContract: {
      set(_id) {
        this.assignment.contract = _id ? _.cloneDeep(this.contracts.find(e => e._id === _id)) : null;
      },
      get() {
        return this.assignment.contract?._id;
      },
    },

  },

  methods: {

    async sendAssignment() {

      await this.$refs.form.validate();

      if (this.formIsValid) {

        this.sendingData = true;

        addNewAssignment(this.assignment)
            .then(() => {
              this.snackBar = showAlert('Добавлена новая задача!').success();
              this.$emit('add:success');
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось добавить задачу!').error();
              console.log('Не удалось добавить задачу', err);
            })
            .finally(() => {
              this.sendingData = false;
            })
      }
    },

    fetchContractsAll() {
      this.fetchingContracts = true;
      fetchContractsAll()
          .then(response => {
            this.contracts = response?.data;
          })
          .catch(err => {
            this.contracts = testDataContracts;
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.fetchingContracts = false;
          })
    },

    clear() {
      this.assignment = {}
    }

  },

}
</script>