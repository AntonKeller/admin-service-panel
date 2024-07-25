<template>
  <v-sheet color="grey-lighten-4">
    <v-card variant="text" width="600" color="blue-grey-darken-4">
      <v-card-title>Новое задание</v-card-title>
      <v-card-subtitle>Введите информацию о задаче</v-card-subtitle>

      <v-card-item>
        <div class="d-flex flex-column ga-4">
          <c-my-form-input v-model="assignment.title" label="Заголовок задания"/>
          <c-my-form-input v-model="assignment.description" label="Описание"/>

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
                    color="teal-darken-3"
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
        </div>
      </v-card-item>

      <v-card-actions>
        <v-btn
            rounded="sm"
            color="teal-darken-3"
            variant="outlined"
            @click="add"
        >
          Добавить
        </v-btn>
        <v-btn
            rounded="sm"
            color="teal-darken-3"
            variant="outlined"
            @click="clear"
        >
          Очистить
        </v-btn>
      </v-card-actions>

    </v-card>

    <v-overlay v-model="contractAddMenuShow" class="d-flex justify-center align-center">
      <c-contract-card-add-menu :returnContract="fetchContractsData"/>
    </v-overlay>

  </v-sheet>
</template>

<script>
import {addAssignment} from '../utils/methods/assignment-requests';
import {fetchContracts} from "@/utils/methods/contract-requests";
import {testDataContracts} from "@/configs/data-test/data-test-contracts";
import _ from "lodash";

export default {
  name: "c-assignment-card-add-menu",

  props: {
    hideMenu: Function,
  },

  data: () => ({

    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: ({})
    },

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
        _id: '',
        title: '',
        description: '',
        contract: ({}),
      }
    }

  },

}
</script>