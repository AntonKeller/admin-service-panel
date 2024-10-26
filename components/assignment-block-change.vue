<template>
  <v-sheet
      rounded="lg"
      elevation="6"
      color="grey-lighten-4"
  >
    <v-card
        rounded="lg"
        variant="text"
        width="800"
        color="blue-grey-darken-3"
    >
      <v-card-title>Редактор Блока ТЗ</v-card-title>

      <v-card-subtitle>Заполните поля</v-card-subtitle>

      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
          <my-text-field
              v-model="block.title"
              :rules="blockTitleRules"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Заголовок"
          />
          <div class="d-flex ga-2">
            <my-date-picker
                v-model="block.startDate"
                :rules="blockStartDateRules"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата начала"
                fieldWidth="100"
            />
            <my-date-picker
                v-model="block.endDate"
                :rules="blockEndDateRules"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата окончания"
                fieldWidth="100"
            />
          </div>
          <div class="d-flex ga-2">
            <my-text-field
                v-model="block.loanAgreement"
                :rules="blockLoanAgreementRules"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Номер кредитного договора"
                fieldWidth="100"
            />
            <my-date-picker
                v-model="block.loanAgreementDate"
                :rules="blockLoanAgreementDateRules"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата кредитного договора"
                fieldWidth="100"
            />
          </div>
          <div class="d-flex ga-2">
            <my-text-field
                v-model="block.pledgeAgreement"
                :rules="blockPlegeAgreementRules"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Номер договора залога"
                fieldWidth="100"
            />
            <my-date-picker
                v-model="block.pledgeAgreementDate"
                :rules="blockPlegeAgreementDateRules"
                prepend-inner-icon="mdi-calendar-range"
                label="Дата договора залога"
                fieldWidth="100"
            />
          </div>
          <div class="d-flex ga-2">
            <v-autocomplete
                v-model="block.inspector"
                :items="inspectors"
                style="width: 100px"
                prepend-inner-icon="mdi-account-hard-hat-outline"
                color="blue-grey-darken-3"
                density="comfortable"
                variant="outlined"
                label="Инспектор"
                rounded="lg"
                closable-chips
                chips
            >
              <template v-slot:chip="{ props, item }">
                <v-chip
                    v-bind="props"
                    :text="`${item.raw?.lastName} ${item.raw?.firstName}`"
                    prepend-icon="mdi-file-document-edit"
                    color="blue-grey-darken-3"
                    density="comfortable"
                />
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    :title="`${item.raw?.lastName} ${item.raw?.firstName}`"
                    :subtitle="`${item.raw?.email} / ${item.raw?.phoneNumber}`"
                    prepend-icon="mdi-file-document-edit"
                />
              </template>
            </v-autocomplete>

            <v-combobox
                v-model="block.status"
                :items="assignment_block_statuses"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Статус"
                density="comfortable"
                style="width: 100px"
                variant="outlined"
                rounded="lg"
            />
          </div>
        </v-form>
      </v-card-item>

      <v-card-actions>
        <my-btn-submit
            text="Принять"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sendingData"
            @click="updateBlock"
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

  </v-sheet>
</template>

<script>
import {changeAssignmentBlock} from "../utils/api/api_assignment_blocks";
import assignment_block_statuses from "../configs/assignment-statuses";
import {isDate, isEmpty} from "../utils/validators/functions.js";
import {fetchInspectorsAll} from "../utils/api/api_inspectors";
import {showAlert} from "../utils/functions.js";
import _ from "lodash";

export default {
  name: "assignment-block-change",

  data: () => ({
    block: {},
    inspectors: [],
    fetchingInspectors: false,
    snackBar: {},
    formIsValid: null,
    sendingData: false,
    assignment_block_statuses,
    blockTitleRules: [isEmpty],
    blockStartDateRules: [isDate],
    blockEndDateRules: [isDate],
    blockLoanAgreementRules: [isEmpty],
    blockLoanAgreementDateRules: [isDate],
    blockPlegeAgreementRules: [isEmpty],
    blockPlegeAgreementDateRules: [isDate],
  }),

  beforeMount() {
    this.block = _.cloneDeep(this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']);
  },

  mounted() {
    this.fetchInspectors();
  },

  methods: {

    clear() {
      this.block = {
        title: null,
        startDate: null,
        endDate: null,
        loanAgreement: null,
        loanAgreementDate: null,
        pledgeAgreement: null,
        pledgeAgreementDate: null,
        status: 'КП',
        inspector: null,
      }
    },

    fetchInspectors() {
      this.fetchingInspectors = true;
      fetchInspectorsAll()
          .then(response => {
            this.inspectors = response.data;
          })
          .catch((err) => {
            console.log('Ошибка получения инспекторов', err);
          })
          .finally(() => {
            this.fetchingInspectors = false;
          })
    },

    async updateBlock() {

      await this.$refs.form.validate();

      if (this.formIsValid) {
        this.sendingData = true;
        changeAssignmentBlock(this._assignmentId, this.block)
            .then(() => {
              this.snackBar = showAlert('Успешно').success();
              this.$emit('update:success');
            })
            .catch((err) => {
              this.snackBar = showAlert('Ошибка изменения').error();
              console.log('Ошибка изменения', err);
            })
            .finally(() => {
              this.sendingData = false;
            })
      }
    }
  }


}
</script>