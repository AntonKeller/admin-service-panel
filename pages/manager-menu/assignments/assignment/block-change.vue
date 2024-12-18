<template>
  <v-container fluid>
    <v-sheet class="ml-8 mt-6">
      <v-card
          variant="text"
          min-width="400"
          max-width="1024"
      >
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <div>Редактирование адреса ТЗ</div>
            <v-btn
                density="comfortable"
                color="blue-grey-darken-2"
                icon="mdi-arrow-left"
                variant="text"
                rounded="lg"
                @click="navigateBack"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Назад
              </v-tooltip>
            </v-btn>
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
                      label="Заголовок"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col :cols="12">
                  <my-date-picker
                      v-model="block.startDate"
                      label="Дата начала"
                  />
                </v-col>
                <!--            <v-col :cols="cols">-->
                <!--              <my-date-picker-->
                <!--                  v-model="block.endDate"-->
                <!--                  label="Дата окончания"-->
                <!--                  class="ml-1"-->
                <!--              />-->
                <!--            </v-col>-->
              </v-row>

              <v-row no-gutters>
                <v-col :cols="cols">
                  <my-text-field
                      v-model="block.loanAgreement"
                      label="Номер кредитного договора"
                  />
                </v-col>
                <v-col :cols="cols">
                  <my-date-picker
                      v-model="block.loanAgreementDate"
                      label="Дата кредитного договора"
                      class="ml-2"
                  />
                </v-col>
              </v-row>

              <v-row no-gutters>
                <v-col :cols="cols">
                  <my-text-field
                      v-model="block.pledgeAgreement"
                      label="Номер договора залога"
                  />
                </v-col>
                <v-col :cols="cols">
                  <my-date-picker
                      v-model="block.pledgeAgreementDate"
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
                        no-data-text="нет данных"
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
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {changeAssignmentBlock} from "../../../../utils/api/api_assignment_blocks.js";
import assignment_block_statuses from "../../../../configs/assignment-statuses.js";
import {isDate, isEmpty} from "../../../../utils/validators/functions.js";
import {fetchInspectors} from "../../../../utils/api/api_inspectors.js";
import _ from "lodash";
import {navigateTo} from "nuxt/app";

export default {
  name: "block-change",

  data: () => ({
    block: {
      _id: null,
      title: null,
      startDate: null,
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
    formIsValid: null,
    sendingData: false,
    inspectorMenuAdd: false,
    assignment_block_statuses,
    blockTitleRules: [isEmpty],
    blockStartDateRules: [isDate],
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

    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment');
    },

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
              this.$store.commit('alert/SUCCESS', 'Адрес осмотра успешно изменен');
              this.navigateBack();
            })
            .catch((err) => {
              this.$store.commit('alert/ERROR', 'Ошибка изменения адреса осмотра');
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