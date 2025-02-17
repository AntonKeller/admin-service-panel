<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1024">

      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card variant="flat" :loading="sending" :disabled="sending">

        <v-card-title>Редактирование задания</v-card-title>
        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
            <v-row dense>
              <v-col :cols="12">
                <v-text-field
                    v-model="assignment.title"
                    v-bind="inputFieldStyle"
                    :rules="assignmentTitleRules"
                    label="Заголовок задания"
                    prepend-inner-icon="mdi-label-variant-outline"
                />
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-customers v-model="assignment.customer"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-contracts v-model="assignment.contract"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-subContracts v-model="assignment.subContract"
                                              :parentID="assignment.contract?._id || null"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-loanAgreements v-model="assignment.loanAgreements"/>
              </v-col>
              <v-col :cols="12">
                <my-autocomplete-pledgeAgreements v-model="assignment.pledgeAgreements"/>
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Принять"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              @click="sendAssignment"
          />
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {changeAssignment, fetchAssignmentOneById} from "../../../utils/api/api_assignments";
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignment-change-page",

  data() {
    return {
      assignment: {
        _id: null, // _id - всегда null при добавлении
        title: null, // Заголовок задачи
        customer: null, // Заказчик
        contract: null, // Договор
        subContract: null, // Техническое задание
        loanAgreements: null, // Кредитный договор
        pledgeAgreements: null, // Договор залога
      },

      formIsValid: false,
      sending: false,
      assignmentTitleRules: [v => v && v?.length <= 50 || 'Кол-во символов должно быть <= 50'],

      // import styles
      inputFieldStyle,
      navigateBackBtnStyle
    }
  },

  async beforeMount() {
    if (!this.selectedAssignment?._id) {
      this.navigateBack();
    } else {
      await fetchAssignmentOneById(this.selectedAssignment._id)
          .then((resp) => {
            this.$store.commit('assignments/SELECT', resp.data);
            this.assignment = _.cloneDeep(resp.data);
            sessionStorage.selectedAssignment = JSON.stringify(resp.data);
          })
          .catch(err => {
            console.log('К сожалению карточка больше не существует', err);
            sessionStorage.removeItem('selectedAssignment');
            this.$store.commit('assignments/RESET_SELECT');
            this.navigateBack();
            this.$store.commit('alert/ERROR', 'Карточка больше не существует!');
          });
    }
  },

  computed: {
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'] || [];
    },
    selectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },
  },

  watch: {
    ['assignment.contract'](newValue) {
      if (!newValue) {
        this.assignment.subContract = null;
      }
    }
  },

  methods: {

    navigateBack() {
      navigateTo('/manager-menu/assignments');
    },

    async sendAssignment() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены!');
        return;
      }

      this.sending = true;

      changeAssignment(this.assignment)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Задание успешно изменено');
            this.navigateBack();
          })
          .catch(err => {
            this.$store.commit('alert/SUCCESS', 'Ошибка изменения задания');
            console.log('Ошибка изменения задания', err);
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.assignment = {
        _id: null, // _id - всегда null при добавлении
        title: null, // Заголовок задачи
        customer: null, // Заказчик
        contract: null, // Договор
        subContract: null, // Техническое задание
        loanAgreements: null, // Кредитный договор
        pledgeAgreements: null, // Договор залога
      }
    }
  }
}
</script>