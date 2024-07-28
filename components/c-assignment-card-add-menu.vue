<template>
  <v-sheet color="grey-lighten-4">
    <v-card variant="text" width="600" color="blue-grey-darken-4">
      <v-card-title>Новое задание</v-card-title>
      <v-card-subtitle>Введите информацию о задаче</v-card-subtitle>

      <v-card-item>
        <my-text-field
            v-model="assignment.title"
            label="Заголовок задания"
        />
        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="selectContract"
              :items="contracts"
              density="comfortable"
              variant="filled"
              color="blue-grey-lighten-2"
              item-title="contractNumber"
              item-value="_id"
              label="Договор"
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
              @click="contractAddMenuShow = true"
              variant="tonal"
              icon="mdi-plus"
              rounded="sm"
          />
        </div>
        <v-textarea v-model="assignment.description" auto-grow />
      </v-card-item>

      <v-card-actions>
        <my-btn-submit text="Добавить" @click="add"/>
        <my-btn-clear text="Очистить" @click="clear" />
      </v-card-actions>

    </v-card>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

    <my-overlay v-model="contractAddMenuShow">
      <c-contract-card-add-menu :returnContract="fetchContractsData"/>
    </my-overlay>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "@/utils/service/serverAPI.js";
import {addAssignment} from '../utils/methods/assignment-requests';
import {fetchContracts} from "@/utils/methods/contract-requests";
import {testDataContracts} from "@/configs/data-test/data-test-contracts";

export default {
  name: "c-assignment-card-add-menu",

  props: {
    hideMenu: Function,
  },

  data: () => ({

    assignment: {
      contract: {}
    },

    snackBar: {},

    contracts: [],
    selectedContract: null,
    contractAddMenuShow: false,

  }),

  mounted() {
    this.fetchContractsData();
  },

  computed: {
    selectContract: {
      set(_id) {
        this.assignment.contract = _id ? _.cloneDeep(this.contracts.find(e => e._id === _id)) : null;
      },
      get() {
        return this.assignment.contract?._id;
      },
    }
  },

  methods: {

    setContract(newContract) {
      this.assignment.contract = {...newContract}
      this.contractsMenuVisible = false;
      console.log('select contract:', this.assignment.contract);
    },

    add() {

      let data = {
        title: this.assignment.title,
        description: this.assignment.description,
        contractId: this.assignment.contract._id,
      };

      addAssignment(data, 0)
          .then(() => {
            this.snackBar = showAlert('Добавлена новая задача!').success();
          })
          .catch(err => {
            this.snackBar = showAlert('Не удалось добавить задачу!').error();
            console.log('Не удалось добавить задачу', err)
          })
    },

    fetchContractsData() {
      fetchContracts()
          .then(response => {
            this.contracts = response?.data?.reverse();
          })
          .catch(err => {
            this.contracts = testDataContracts?.reverse();
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.loadingData = false;
          });
    },

    clear() {
      this.assignment = {
        contract: {},
      }
    }

  },

}
</script>