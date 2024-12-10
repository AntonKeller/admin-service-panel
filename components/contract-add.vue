<template>
  <v-sheet color="grey-lighten-4">
    <v-card
        variant="text"
        width="700"
        color="blue-grey-darken-3"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>Новый договор</div>
          <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
        </div>
      </v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>

      <v-card-text>
        <v-form v-model="isValid" class="d-flex flex-column ga-2">
          <my-text-field
              v-model="contract.contractNumber"
              prepend-inner-icon="mdi-file-sign"
              label="Номер договора"
              placeholder="..../..."
          />
          <my-date-picker
              v-model="contract.contractDate"
              prepend-inner-icon="mdi-calendar-range"
              label="Дата заключения"
              placeholder="дд:мм:гггг"
          />

          <div class="d-flex ga-1">
            <v-autocomplete
                v-model="contract.contractExecutor"
                :items="contractExecutors"
                :loading="fetchingContractExecutors"
                :rules="[v => !!v || 'Выберите исполнителя']"
                prepend-inner-icon="mdi-account-tie"
                color="yellow-darken-3"
                no-data-text="нет данных"
                density="compact"
                variant="outlined"
                label="Исполнитель"
                closable-chips
                chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    color="blue-grey-darken-3"
                    density="comfortable"
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :text="`${item.raw.surname}  ${item.raw.firstName} ${item.raw.lastName} ${item.raw.position} ${item.raw.companyName}`"
                />
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    prepend-icon="mdi-file-document-edit"
                    :title="item.raw.surname + ' ' + item.raw.firstName + ' ' + item.raw.lastName"
                    :subtitle="item.raw.position + ' '+ item.raw.companyName"
                />
              </template>
            </v-autocomplete>
            <v-btn
                icon="mdi-plus"
                variant="text"
                rounded="lg"
                size="small"
                @click="contractExecutorMenuAddVisibility = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Добавить исполнителя
              </v-tooltip>
            </v-btn>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            :loading="loading"
            @click="submit"
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

    <my-overlay v-model="contractExecutorMenuAddVisibility">
      <contract-executor-add @add:success="onContractExecutorAddSuccess"
                             @click:close="contractExecutorMenuAddVisibility=false"></contract-executor-add>
    </my-overlay>

  </v-sheet>
</template>

<script>
import {fetchContractExecutors} from "../utils/api/api_contract_executors";
import {addContract} from "../utils/api/api_contracts";
import {showAlert} from "../utils/functions";

export default {
  name: "contract-add",

  data() {
    return {
      isValid: null,
      loading: false,
      contract: {
        contractNumber: null,
        contractDate: null,
        customer: null,
        contractExecutor: null,
      },
      snackBar: {},
      contractExecutors: [],
      fetchingContractExecutors: false,
      contractExecutorMenuAddVisibility: false,
      contractContractNumberRules: [
        v => v?.length > 0 || 'Договора должна быть больше 0',
        v => v?.length <= 18 || 'Договора должна быть меньше 18',
      ],
      contractDateRules: [v => /^\d{2}\.\d{2}\.\d{4}$/i.test(v) ? true : 'Неподходящий формат даты'],
    }
  },

  mounted() {
    this.fetchContractExecutors();
  },

  methods: {

    onContractExecutorAddSuccess(){
      this.contractExecutorMenuAddVisibility = false;
      this.fetchContractExecutors();
    },

    submit() {
      if (this.isValid) {
        this.loading = true;
        addContract(this.contract)
            .then(() => {
              this.snackBar = showAlert('Добавлен новый договор!').success();
              this.$emit('add:success');
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось добавить договор!').error();
              console.log('Ошибка добавления договора', err);
            })
            .finally(() => {
              this.loading = false;
            })
      } else {
        this.snackBar = showAlert('Поля не заполнены!').error();
      }
    },

    async fetchContractExecutors() {

      this.fetchingContractExecutors = true;

      fetchContractExecutors()
          .then(response => {
            this.contractExecutors = response.data;
          })
          .catch(err => {
            console.log('Ошибка получения исполнителей', err);
          })
          .finally(() => {
            this.fetchingContractExecutors = false;
          })
    },

    clear() {
      this.contract = {}
    }

  }
}
</script>