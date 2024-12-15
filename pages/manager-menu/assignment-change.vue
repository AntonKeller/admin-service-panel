<template>
  <v-container fluid>
    <v-card
        variant="elevated"
        min-width="200px"
        max-width="600px"
        width="100%"
        rounded
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>Редактор задания</div>
          <my-button-close-card @click="goBack" class="align-self-start"/>
        </div>
      </v-card-title>
      <v-card-subtitle/>
      <v-card-text>
        <v-form v-model="formIsValid" ref="form">
          <my-text-field
              v-model="assignment.title"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Заголовок тех. задания"
          />
          <v-autocomplete
              v-model="assignment.contract"
              :disabled="loadingContracts"
              :loading="loadingContracts"
              :items="contracts"
              :rules="[v => v || 'Выберите договор']"
              prepend-inner-icon="mdi-file-sign"
              no-data-text="нет данных"
              color="yellow-darken-3"
              density="compact"
              variant="outlined"
              label="Договор"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  :text="`${item.raw?.contractNumber} / ${item.raw?.contractDate} / ${item.raw?.customer?.shortName}`"
                  prepend-icon="mdi-file-document-edit"
                  color="blue-grey-darken-4"
                  density="comfortable"
                  rounded="sm"
              />
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  :title="item.raw?.contractNumber"
                  :subtitle="item.raw?.contractDate  + ' / ' + item.raw?.customer?.shortName"
              />
            </template>
          </v-autocomplete>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <my-btn-submit
            text="Подтвердить"
            :loading="changing"
            @click="sendChanges"
        />
        <my-btn-clear text="Очистить" @click="this.assignment = {}"/>
      </v-card-actions>

      <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackBar.msg }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import {changeAssignment} from "../../utils/api/api_assignments";
import {fetchContractsAll} from "../../utils/api/api_contracts";
import {fetchCustomersAll} from "../../utils/api/api_customers";
import {showAlert} from "../../utils/functions";
import _ from "lodash";

export default {
  name: "assignment-change-page",

  data() {
    return {
      assignment: {},
      contracts: [],
      customers: [],
      loadingContracts: false,
      loadingCustomers: false,
      formIsValid: false,
      changing: false,
      snackBar: {},
    }
  },

  beforeMount() {
    this.assignment = _.cloneDeep(this.$store.getters['assignments/GET_SELECTED_ITEM']);
    this.fetchContracts();
    this.fetchCustomers();
  },

  methods: {

    goBack() {
      navigateTo('/manager-menu/assignments');
    },

    async sendChanges() {

      await this.$refs.form.validate();

      if (this.formIsValid) {

        this.changing = true;

        changeAssignment(this.assignment)
            .then(() => {
              this.snackBar = showAlert('Изменено успешно!').success();
              this.$emit('update:success');
              this.goBack();
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось изменить!').error();
              this.$emit('update:error');
            })
            .finally(() => {
              this.changing = false;
            })
      }
    },

    fetchContracts() {

      this.loadingContracts = true;

      fetchContractsAll()
          .then(response => {
            this.contracts = response?.data?.reverse();
          })
          .catch(err => {
            console.log('Запрос списка договоров выполнен с ошибкой', err);
          })
          .finally(() => {
            this.loadingContracts = false;
          })
    },

    fetchCustomers() {
      this.loadingCustomers = true;
      fetchCustomersAll()
          .then(data => {
            this.customers = data;
          })
          .catch(err => {
            console.log('Ошибка получения заказчиков/организаций\n', err);
          })
          .finally(() => {
            this.loadingCustomers = false;
          })
    },

  }
}
</script>