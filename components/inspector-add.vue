<template>
  <v-card width="700" elevation="6">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новый инспектор</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Заполните поля</v-card-subtitle>

    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">
        <my-text-field v-model="inspector.firstName" label="Имя"/>
        <my-text-field v-model="inspector.surName" label="Фамилия"/>
        <my-text-field v-model="inspector.lastName" label="Отчество"/>
        <div class="d-flex ga-2">
          <my-text-field v-model="inspector.phoneNumber" v-mask="options" label="Номер телефона"
                         placeholder="+7 (___) ___-__-__"/>
          <my-text-field v-model="inspector.email" label="Email"/>
        </div>
        <my-text-field v-model="inspector.login" label="Логин"/>
        <my-text-field v-model="inspector.password" label="Пароль"/>
      </v-form>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="addInspector"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addInspector} from "../utils/api/api_inspectors";
import {vMaska} from "maska/vue"

export default {
  name: "inspector-add",

  emits: ['add:success'],

  directives: {
    mask: vMaska
  },

  data() {
    return {

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

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
              this.$store.commit('alert/SUCCESS', 'Инспектор успешно добавлен');
              this.$emit('add:success')
            })
            .catch((err) => {
              console.log('Ошибка добавление инспектора', err);
              this.$store.commit('alert/ERROR', 'Ошибка добавление инспектора');
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