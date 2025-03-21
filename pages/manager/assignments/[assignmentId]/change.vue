<template>
  <v-container fluid class="bg-white">
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
                <my-autocomplete-subContracts
                    v-model="assignment.subContract"
                    :parentID="assignment.contract?._id || null"
                />
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
import {changeAssignment, fetchAssignmentOneById} from "@/utils/api/api_assignments";
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";

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
    fetchAssignmentOneById(useRoute().params.assignmentId)
        .then(response => {
          this.assignment = response.data ?? this.assignment;
        })
        .catch(err => {
          console.log('Ошибка, такого задания не существует', err);
          this.$store.commit('alert/SUCCESS', 'Такого задания не существует');
          this.navigateBack();
        })
  },

  computed: {
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'] || [];
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
      navigateTo(`/manager/assignments`);
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