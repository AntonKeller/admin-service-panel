<template>
  <v-card rounded="sm" width="700" elevation="6">

    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новая задача</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Заполните поля</v-card-subtitle>

    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
        <my-text-field
            v-model="assignment.title"
            label="Заголовок задания"
            prepend-inner-icon="mdi-label-variant-outline"
        />

        <div class="d-flex ga-1">
          <v-autocomplete
              v-model="assignment.contract"
              :rules="contractRules"
              :items="getContracts"
              no-data-text="Пусто"
              prepend-inner-icon="mdi-file-sign"
              color="yellow-darken-3"
              density="compact"
              variant="outlined"
              label="Договор"
              closable-chips
              single-line
              chips
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  color="blue-grey-darken-3"
                  density="comfortable"
                  :text="`${item.raw?.contractNumber} / ${item.raw?.customer?.shortName}`"
              />
            </template>

            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-file-document-edit"
                  :title="item.raw?.contractNumber"
                  :subtitle="item.raw?.contractDate  + ' / ' + item.raw?.customer?.shortName"
              />
            </template>
          </v-autocomplete>

          <v-btn
              icon="mdi-plus"
              variant="text"
              size="small"
              rounded="lg"
              @click="contractMenuAddShow = true"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Добавить новый договор
            </v-tooltip>
          </v-btn>
        </div>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="sendAssignment"
      />
      <my-btn-clear
          text="Очистить"
          @click="assignment = {}"
      />
    </v-card-actions>

    <v-snackbar :color="getAlert.type" v-model="getAlert.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ getAlert.msg }}
    </v-snackbar>


    <v-overlay v-model="contractMenuAddShow" class="d-flex justify-center align-center">
      <contract-add @add:success="onContractAddSuccess" @click:close="contractMenuAddShow = false"></contract-add>
    </v-overlay>

  </v-card>
</template>

<script>
import {addNewAssignment} from "../utils/api/api_assignments.js";

export default {
  name: "assignment-add",

  data: () => ({

    formIsValid: false,
    contractMenuAddShow: false,
    assignment: {},

    assignmentTitleRules: [
      value => value?.length > 0 ? true : 'Кол-во символов должно быть > 0',
      value => value?.length <= 50 ? true : 'Кол-во символов должно быть <= 30'
    ],
    contractRules: [
      value => value || 'Выберите договор'
    ],
  }),

  beforeMount() {
    this.$store.dispatch('contracts/UPDATE_ITEMS');
  },

  computed: {
    getContracts() {
      return this.$store.getters['contracts/GET_ITEMS'];
    },
    getAlert() {
      return this.$store.getters['assignments/ALERT'];
    }
  },

  methods: {

    contractsStoreUpdate() {
      this.$store.dispatch('contracts/UPDATE_ITEMS');
    },

    onContractAddSuccess() {
      this.contractMenuAddShow = false;
      this.contractsStoreUpdate();
    },

    async sendAssignment() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addNewAssignment(this.assignment)
            .then(() => {
              this.$store.dispatch('assignments/FETCH');
              this.$emit('add:success');
            })
            .catch((err) => {
              console.log('Ошибка добавления задачи', err)
            })
      }
    }
  }
}
</script>

<!--<style>-->
<!--@font-face {-->
<!--  font-family: 'TildaSans-Regular';-->
<!--  src: url('~assets/fonts/TildaSans-Regular.ttf') format('opentype'),-->
<!--}-->
<!--</style>-->