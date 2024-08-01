<template>
  <v-sheet color="grey-lighten-4">
    <v-card variant="text" width="700" color="blue-grey-darken-4">

      <v-card-title>Новое задание</v-card-title>

      <v-card-subtitle>Введите информацию о задаче</v-card-subtitle>

      <v-card-item>
        <v-form v-model="formIsValid" ref="form">
          <my-text-field
              v-model="assignment.title"
              :rules="rules.assignmentTitleField"
              label="Заголовок задания"
          />
          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="selectContract"
                :items="contracts"
                :rules="rules.contractField"
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
                variant="tonal"
                icon="mdi-plus"
                rounded="sm"
                @click="contractAddMenuShow = true"
            />
          </div>
          <v-textarea
              v-model="assignment.description"
              :rules="rules.assignmentDescription"
              auto-grow
          />
        </v-form>
      </v-card-item>

      <v-card-actions>
        <my-btn-submit :loading="loading" text="Добавить" @click="sendAssignment"/>
        <my-btn-clear text="Очистить" @click="clear"/>
      </v-card-actions>

    </v-card>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

    <my-overlay v-model="contractAddMenuShow">
      <c-contract-card-add-menu @add:success="fetchContracts"/>
    </my-overlay>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "@/utils/service/serverAPI.js";
import {addNewAssignment} from '../utils/methods/assignment-requests';
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

    rules: {
      assignmentTitleField: [
        value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      ],
      contractField: [
        value => value?.length > 0 ? true : 'Не выбран контракт',
      ],
      assignmentDescription: [
        value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
        value => value?.length < 151 ? true : 'Кол-во символов должно быть <= 150',
      ]
    },

    loading: false,
    formIsValid: false,
    snackBar: {},
    contracts: [],
    contractAddMenuShow: false,

  }),

  mounted() {
    this.fetchContracts();
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

    async sendAssignment() {

      await this.$refs.form.validate();

      if (this.formIsValid) {

        let data = {
          title: this.assignment.title,
          description: this.assignment.description,
          contractId: this.assignment.contract._id,
        }

        this.loading = true;

        addNewAssignment(data)
            .then(() => {
              this.snackBar = showAlert('Добавлена новая задача!').success();
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось добавить задачу!').error();
              console.log('Не удалось добавить задачу', err)
            })
            .finally(() => {
              this.loading = false;
            })
      }
    },

    fetchContracts() {
      fetchContracts()
          .then(response => {
            this.contracts = response?.data?.reverse();
          })
          .catch(err => {
            this.contracts = testDataContracts?.reverse();
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
    },

    clear() {
      this.assignment = {
        contract: {},
      }
    }

  },

}
</script>