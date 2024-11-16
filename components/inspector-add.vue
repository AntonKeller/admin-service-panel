<template>
  <v-card rounded="sm" width="700" elevation="6">
    <v-card-title>Новый инспектор</v-card-title>

    <v-card-subtitle>Заполните поля</v-card-subtitle>

    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
        <my-text-field v-model="inspector.firstName" :rules="inspectorFirstNameRules" label="Имя"/>
        <my-text-field v-model="inspector.surName" :rules="inspectorSurNameRules" label="Фамилия"/>
        <my-text-field v-model="inspector.lastName" :rules="inspectorLastNameRules" label="Отчество"/>
        <div class="d-flex ga-2">
          <my-text-field v-model="inspector.phoneNumber" :rules="inspectorPhoneNumberRules" label="Номер телефона"/>
          <my-text-field v-model="inspector.email" :rules="inspectorEmailRules" label="Email"/>
        </div>
        <my-text-field v-model="inspector.login" :rules="inspectorLoginRules" label="Логин"/>
        <my-text-field v-model="inspector.password" :rules="inspectorPasswordRules" label="Пароль"/>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="addInspector"
      />
      <my-btn-clear text="Очистить" @click="clear"/>
    </v-card-actions>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>
  </v-card>
</template>

<script>
import {addInspector} from "../utils/api/api_inspectors";
import {showAlert} from "../utils/functions";

export default {
  name: "inspector-add",

  emits: ['add:success'],

  data() {
    return {
      inspector: {
        firstName: null,
        surName: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      },
      formIsValid: false,
      snackBar: {},
      inspectorFirstNameRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorSurNameRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorLastNameRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorPhoneNumberRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorEmailRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorLoginRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
      inspectorPasswordRules: [
          v => v?.length > 0 || 'поле не должно быть пустым',
          v => v.length <= 30 || 'поле не должно превышать 30 символов'
      ],
    }
  },

  methods: {
    async addInspector() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        addInspector(this.inspector)
            .then(() => {
              this.snackBar = showAlert('Инспектор успешно добавлен').success();
              this.$emit('add:success')
            })
            .catch((err) => {
              console.log('Ошибка добавление инспектора', err);
              this.snackBar = showAlert('Ошибка добавление инспектора').error();
            })
      }
    },
    clear() {
      this.inspector = {
        firstName: null,
        surName: null,
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