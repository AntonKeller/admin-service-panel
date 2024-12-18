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
            <div>Редактор задания</div>
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
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
            <my-text-field
                v-model="assignment.title"
                :rules="assignmentTitleRules"
                label="Заголовок задания"
                prepend-inner-icon="mdi-label-variant-outline"
            />
            <myAutocompleteCustomers v-model="assignment.customer"/>
            <myAutocompleteContracts v-model="assignment.contract"/>
            <myAutocompleteSubContracts v-model="assignment.subContract"/>
            <myAutocompleteLoanAgreements v-model="assignment.loanAgreements"/>
            <myAutocompletePledgeAgreements v-model="assignment.pledgeAgreements"/>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Подтвердить"
              :loading="changing"
              @click="sendChanges"
          />
          <my-button-clear text="Очистить" @click="this.assignment = {}"/>
          <v-btn density="compact" size="small" text="print object" @click="console.log(assignment)"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {changeAssignment, fetchAssignmentOneById} from "../../../utils/api/api_assignments";
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
      changing: false,

      assignmentTitleRules: [v => v && v?.length <= 50 || 'Кол-во символов должно быть <= 50'],
    }
  },

  async beforeMount() {
    if (!this.$store.getters['assignments/SELECTED']?._id) {
      this.navigateBack();
    } else {
      await fetchAssignmentOneById(this.$store.getters['assignments/SELECTED']._id)
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
            this.$store.commit('assignments/ALERT_ERROR', 'Карточка больше не существует!');
          });
    }
  },

  computed: {
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'] || [];
    },
  },

  methods: {

    navigateBack() {
      navigateTo('/manager-menu/assignments');
    },

    async sendChanges() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.changing = true;
        changeAssignment(this.assignment)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Задание успешно изменено');
              this.navigateBack();
            })
            .catch(err => {
              this.$store.commit('alert/SUCCESS', 'Ошибка изменения задания');
            })
            .finally(() => {
              this.changing = false;
            })
      }
    },
  }
}
</script>