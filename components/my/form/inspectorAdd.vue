<template>
  <v-card :loading="sending" :disabled="sending" elevation="0" width="100vw" max-width="800">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Создание новый записи инспектор</div>
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
      <v-form v-model="formIsValid" ref="form" class="mt-2">
        <v-row dense>
          <v-col :cols="12">
            <my-text-field v-model="inspector.firstName" label="Имя" :rules="[isNotEmptyRule]"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="inspector.surname" label="Фамилия"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="inspector.lastName" label="Отчество"/>
          </v-col>
          <v-col :cols="6">
            <my-text-field v-model="inspector.phoneNumber" v-mask="options" label="Номер телефона"
                           placeholder="+7 (___) ___-__-__"/>
          </v-col>
          <v-col :cols="6">
            <my-text-field v-model="inspector.email" label="Email"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="inspector.login" label="Логин"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="inspector.password" label="Пароль"/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="sending"
          @click="addInspector"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addInspector} from "../../../utils/api/api_inspectors";
import {isNotEmptyRule} from '@/utils/validators/functions';
import {vMaska} from "maska/vue"

export default {
  name: "inspector-add",

  emits: ['add:success'],

  directives: {
    mask: vMaska
  },

  data() {
    return {
      inspector: {
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      },

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

      formIsValid: false,
      sending: false,
    }
  },

  methods: {

    isNotEmptyRule,

    navigateBack() {
      navigateTo('/manager-menu/customers');
    },

    async addInspector() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены');
        return;
      }

      this.sending = true;

      addInspector(this.inspector)
          .then(() => {
            this.$store.dispatch('inspectors/FETCH');
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно добавлен');
            this.$emit('add:success');
          })
          .catch((err) => {
            console.log('Ошибка добавление инспектора', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавление инспектора');
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.inspector = {
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      }
    }
  }
}
</script>