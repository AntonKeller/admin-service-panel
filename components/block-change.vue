<template>
  <v-card
      min-width="400"
      max-width="900"
      width="100vw"
  >
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Редактор блока задания</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Заполните поля</v-card-subtitle>

    <v-card-item>
      <v-sheet height="550" class="pr-2" style="overflow-y: scroll">
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1 mt-2">

          <v-row no-gutters>
            <v-col cols="12">
              <my-text-field
                  v-model="block.title"
                  :rules="blockTitleRules"
                  label="Заголовок"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col :cols="cols">
              <my-date-picker
                  v-model="block.startDate"
                  :rules="blockStartDateRules"
                  label="Дата начала"
              />
            </v-col>
            <v-col :cols="cols">
              <my-date-picker
                  v-model="block.endDate"
                  :rules="blockEndDateRules"
                  label="Дата окончания"
                  class="ml-1"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col :cols="cols">
              <my-text-field
                  v-model="block.loanAgreement"
                  :rules="blockLoanAgreementRules"
                  label="Номер кредитного договора"
              />
            </v-col>
            <v-col :cols="cols">
              <my-date-picker
                  v-model="block.loanAgreementDate"
                  :rules="blockLoanAgreementDateRules"
                  label="Дата кредитного договора"
                  class="ml-2"
              />
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col :cols="cols">
              <my-text-field
                  v-model="block.pledgeAgreement"
                  :rules="blockPlegeAgreementRules"
                  label="Номер договора залога"
              />
            </v-col>
            <v-col :cols="cols">
              <my-date-picker
                  v-model="block.pledgeAgreementDate"
                  :rules="blockPlegeAgreementDateRules"
                  label="Дата договора залога"
                  class="ml-2"
              />
            </v-col>
          </v-row>


          <v-row no-gutters>
            <v-col :cols="cols + 2">
              <div class="d-flex ga-1">
                <v-autocomplete
                    v-model="block.inspector"
                    :items="inspectors"
                    color="yellow-darken-3"
                    density="compact"
                    variant="outlined"
                    label="Инспектор"
                    closable-chips
                    chips
                >
                  <template v-slot:chip="{ props, item }">
                    <v-chip
                        v-bind="props"
                        :text="`${item.raw?.lastName} ${item.raw?.firstName}`"
                        prepend-icon="mdi-file-document-edit"
                        color="blue-grey-darken-4"
                        density="comfortable"
                        rounded="sm"
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
                <v-btn
                    icon="mdi-plus"
                    variant="text"
                    rounded="lg"
                    size="small"
                    @click="inspectorMenuAdd = true"
                />
              </div>
            </v-col>
            <v-col :cols="cols - 2">
              <v-combobox
                  v-model="block.status"
                  :items="assignment_block_statuses"
                  :rules="[e => !!e || 'Выберите статус']"
                  color="yellow-darken-3"
                  variant="outlined"
                  density="compact"
                  label="Статус"
                  class="ml-1"
              />
            </v-col>
          </v-row>

          <my-text-field
              v-model="block.pledgeAgreementName"
              label="ФИО залогодателя"
          />

          <div class="d-flex ga-2">
            <my-text-field
                v-model="block.pledgeAgreementPosition"
                label="Должность залогодателя"
            />
            <my-text-field
                v-model="block.pledgeAgreementCompany"
                label="Компания залогодателя"
            />
          </div>

          <my-text-field
              v-model="block.address"
              label="Адрес местонахождения"
          />

          <div class="d-flex ga-2">
            <my-text-field
                v-model="block.contactFullName"
                label="ФИО Контактного лица"
            />
            <my-text-field
                v-model="block.contactPhoneNumber"
                label="Телефон контактного лица"
            />
          </div>

          <my-text-field
              v-model="block.description"
              label="Комментарий"
          />
        </v-form>
      </v-sheet>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Принять"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="sendingData"
          @click="updateBlock"
      />
    </v-card-actions>

    <v-overlay v-model="inspectorMenuAdd" class="d-flex justify-center align-center">
      <inspector-add @add:success="fetchInspectors" @click:close="inspectorMenuAdd=false"></inspector-add>
    </v-overlay>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>
  </v-card>
</template>

<script>
import {changeAssignmentBlock} from "../utils/api/api_assignment_blocks";
import assignment_block_statuses from "../configs/assignment-statuses";
import {isDate, isEmpty} from "../utils/validators/functions.js";
import {fetchInspectors} from "../utils/api/api_inspectors";
import {showAlert} from "../utils/functions.js";
import _ from "lodash";

export default {
  name: "block-change",

  data: () => ({
    block: {
      _id: null,
      title: null,
      startDate: null,
      endDate: null,
      loanAgreement: null,
      loanAgreementDate: null,
      pledgeAgreement: null,
      pledgeAgreementDate: null,
      inspector: null,
      status: null,
      pledgeAgreementName: null,
      pledgeAgreementPosition: null,
      pledgeAgreementCompany: null,
      address: null,
      contactFullName: null,
      contactPhoneNumber: null,
      description: null,
    },
    inspectors: [],
    fetchingInspectors: false,
    snackBar: {},
    formIsValid: null,
    sendingData: false,
    inspectorMenuAdd: false,
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

  computed: {
    cols() {
      const {xxl, xl, lg, md, sm} = this.$vuetify.display;
      const a = xxl || xl || lg || md || sm;
      return a ? 6 : 12;
    }
  },

  methods: {

    fetchInspectors() {
      this.fetchingInspectors = true;
      fetchInspectors()
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
        const assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']?._id;

        changeAssignmentBlock(assignmentId, this.block)
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