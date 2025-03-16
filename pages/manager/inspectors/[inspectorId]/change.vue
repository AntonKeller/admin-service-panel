<template>
  <v-container fluid class="bg-white">
    <v-sheet>
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

      <v-card :loading="sending" :disabled="sending" elevation="0" width="100vw" max-width="800">
        <v-card-title>Редактирование инспектора</v-card-title>
        <v-card-subtitle>Заполните поля</v-card-subtitle>

        <v-card-item>
          <v-form v-model="formIsValid" ref="form" class="mt-2">
            <v-row dense>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.firstName"
                    v-bind="inputFieldStyle"
                    label="Имя"
                    :rules="[isNotEmptyRule]"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.surname"
                    v-bind="inputFieldStyle"
                    label="Фамилия"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.lastName"
                    v-bind="inputFieldStyle"
                    label="Отчество"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="inspector.phoneNumber"
                    v-bind="inputFieldStyle"
                    v-mask="options"
                    label="Номер телефона"
                    placeholder="+7 (___) ___-__-__"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="inspector.email"
                    v-bind="inputFieldStyle"
                    label="Email"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.login"
                    v-bind="inputFieldStyle"
                    label="Логин"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="inspector.password"
                    v-bind="inputFieldStyle"
                    label="Пароль"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-item>

        <v-card-actions>
          <my-btn-submit
              prepend-icon="mdi-checkbox-multiple-marked-outline"
              text="Принять"
              :loading="sending"
              @click="sendInspector"
          />
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>

    </v-sheet>
  </v-container>
</template>

<script>
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {isNotEmptyRule} from '@/utils/validators/functions';
import {changeInspector, fetchInspectorOneById} from "@/utils/api/api_inspectors";
import {navigateTo} from "nuxt/app";
import {vMaska} from "maska/vue"

export default {
  name: "inspector-change",

  directives: {
    mask: vMaska
  },

  beforeMount() {
    fetchInspectorOneById(useRoute().params.inspectorId)
        .then(response => {
          this.inspector = response.data;
        })
        .catch(err => {
          console.log('Такого инспектора не сущетсвует', err);
          this.$store.commit('alert/ERROR', 'Такого инспектора не существует');
          this.navigateBack();
        })
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

      // import styles
      inputFieldStyle,
      navigateBackBtnStyle,
    }
  },

  methods: {

    isNotEmptyRule,

    navigateBack() {
      navigateTo('/manager/inspectors');
    },

    async sendInspector() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены');
        return;
      }

      this.sending = true;

      changeInspector(this.inspector)
          .then(() => {
            this.$store.dispatch('inspectors/FETCH');
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно изменен!');
            this.navigateBack();
          })
          .catch((err) => {
            console.log('Ошибка добавление инспектора', err);
            this.$store.commit('alert/ERROR', 'Ошибка изменения инспектора');
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