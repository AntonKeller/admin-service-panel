<template>
  <v-sheet
      rounded="lg"
      elevation="24"
      color="grey-lighten-4"
  >
    <v-card
        rounded="lg"
        variant="text"
        width="800"
        color="blue-grey-darken-3"
    >

      <v-card-title>Новая задача</v-card-title>

      <v-card-subtitle>Заполните поля</v-card-subtitle>

      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
          <my-text-field
              v-model="assignment.title"
              :rules="assignmentTitleRules"
              label="Заголовок задания"
              prepend-inner-icon="mdi-label-variant-outline"
          />

          <div class="d-flex ga-2">
            <v-autocomplete
                v-model="cContract"
                :items="contracts"
                :rules="contractRules"
                density="comfortable"
                item-title="contractNumber"
                item-value="_id"
                rounded="lg"
                variant="outlined"
                color="blue-grey-darken-3"
                label="Договор"
                prepend-inner-icon="mdi-file-sign"
                chips
                closable-chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    color="blue-grey-darken-3"
                    density="comfortable"
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :text="`${item.raw?.contractNumber} / ${item.raw?.contractDate}`"
                />
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw.contractNumber"
                    :subtitle="item.raw.contractDate"
                />
              </template>
            </v-autocomplete>

            <v-btn
                rounded="lg"
                variant="tonal"
                icon="mdi-plus"
                @click="contractAddMenuShow = true"
            />
          </div>

          <v-textarea
              v-model="assignment.description"
              color="blue-grey-darken-3"
              :rules="assignmentDescriptionRules"
              auto-grow
          />
        </v-form>
      </v-card-item>

      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sendingData"
            @click="sendAssignment"
        />
        <my-btn-clear
            text="Очистить"
            @click="clear"
        />
      </v-card-actions>

    </v-card>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

    <my-overlay v-model="contractAddMenuShow">
      <c-contract-card-add-menu @add:success="fetchContractsAll"/>
    </my-overlay>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "../utils/service/serverAPI";
import {addNewAssignment} from '../utils/methods/assignment-requests';
import {fetchContractsAll} from "../utils/methods/contract-requests";
import {testDataContracts} from "../configs/data-test/data-test-contracts";

export default {
  name: "c-assignment-card-add-menu",
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
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0'
    ],
    contractRules: [
      value => value?.length > 0 ? true : 'Не выбран контракт'
    ],
    assignmentDescriptionRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length < 151 ? true : 'Кол-во символов должно быть <= 150',
    ],

  }),

  mounted() {
    this.fetchContractsAll();
    console.log('contracts', this.contracts)
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