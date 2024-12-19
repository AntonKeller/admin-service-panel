<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1024">
      <v-card variant="text">
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <div>Новый адрес ТЗ</div>
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
          <v-sheet min-height="200px" height="60vh" class="pr-2" style="overflow-y: scroll">
            <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">

              <v-row no-gutters>
                <v-col :cols="6">
                  <!--              Котактное заголовок-->
                  <my-text-field
                      v-model="block.title"
                      label="Заголовок"
                  />
                </v-col>
                <v-col :cols="6">
                  <!--              Котактное адрес-->
                  <my-text-field
                      v-model="block.address"
                      label="Адрес осмотра"
                  />
                </v-col>
              </v-row>

              <v-col :cols="12">
                <my-date-picker v-model="block.startDate" label="Дата начала"/>
              </v-col>

              <v-col :cols="12">

              </v-col>

              <v-col :cols="12">
                <!--              Котактное лицо TODO: создать-->
                <!--                <myAutocompleteContact v-model="block.contact"/>-->
              </v-col>

              <v-col :cols="12">
                <!--              Инспектор TODO: создать-->
                <!--                <myAutocompleteInspector v-model="block.inspector"/>-->
              </v-col>

            </v-form>
          </v-sheet>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              text="Добавить"
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              :loading="sendingAssignmentBlock"
              @click="sendBlock"
          />
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>

        <!--        <v-overlay v-model="inspectorMenuAdd" class="d-flex justify-center align-center">-->
        <!--          <inspector-add @add:success="fetchInspectors" @click:close="inspectorMenuAdd=false"></inspector-add>-->
        <!--        </v-overlay>-->

      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {sendAssignmentBlock} from "../../../../utils/api/api_assignment_blocks.js";
import {fetchInspectors} from "../../../../utils/api/api_inspectors.js";
import {isDate, isEmpty} from "../../../../utils/validators/functions.js";
import {vMaska} from "maska/vue"
import {navigateTo} from "nuxt/app";

export default {
  name: "block-add",

  emits: ['add:success'],

  directives: {
    mask: vMaska
  },

  data() {
    return {

      pledger: {
        _id: null,
        firstName: null,
        surName: null,
        lastName: null,
        inn: null,
        phoneNumber: null,
      },

      contact: {
        _id: null,
        firstName: null,
        surName: null,
        lastName: null,
        phoneNumber: null,
      },

      inspector: {
        _id: null,
        firstName: null,
        surName: null,
        lastName: null,
        phoneNumber: null,
      },

      block: {
        _id: null,
        title: null, // Заголовок
        address: null, // Адрес
        startDate: null, // Дата начала
        pledger: null, // Залогодатель
        contact: null, // Контакт
        inspector: null, // Инспектор
      },

      formIsValid: null,
      sendingAssignmentBlock: false,


      pledgerList: [],
      pledgerListFetching: false,
      pledgerRules: [v => v && v.length > 0],

      contactList: [],
      contactListFetching: false,
      contactRules: [v => v && v.length > 0],

      inspectorList: [],
      inspectorListFetching: false,
      inspectorRules: [v => v && v.length > 0],


      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },
    }
  },

  computed: {
    pledger: {
      get() {

      },
      set(value) {

      }
    },
    contact: {
      get() {

      },
      set(value) {

      }
    },
    inspector: {
      get() {

      },
      set(value) {

      }
    },
  },

  mounted() {
    this.clear();
    this.fetchInspectors();
  },

  methods: {

    clear() {
      this.block = {
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
      }
    },

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

    async sendBlock() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.sendingAssignmentBlock = true;
        sendAssignmentBlock(this._assignmentId, this.block)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Адрес осмотра успешно создан');
              this.navigateBack();
            })
            .catch((err) => {
              this.$store.commit('alert/ERROR', 'Ошибка добавления адреса осмотра');
              console.log('Ошибка добавления', err);
            })
            .finally(() => {
              this.sendingAssignmentBlock = false;
            })
      }
    }
  }
}
</script>