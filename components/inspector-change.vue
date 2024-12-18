<template>
  <v-card width="700" elevation="6">

    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Редактирование данных инспектора</div>
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
          text="Принять"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          @click="changeInspector"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {changeInspector} from "../utils/api/api_inspectors";
import _ from "lodash";
import {vMaska} from "maska/vue"

export default {
  name: "inspector-change",

  emits: ['change:success'],

  props: {
    _inspector: Object,
  },

  directives: {
    mask: vMaska
  },

  mounted() {
    this.inspector = _.cloneDeep(this._inspector);
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
    }
  },

  methods: {
    async changeInspector() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        changeInspector(this.inspector)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Инспектор успешно изменен');
              this.$emit('change:success');
            })
            .catch((err) => {
              this.$store.commit('alert/ERROR', 'Ошибка изменения инспектора');
              console.log('Ошибка изменения инспектора', err);
            })
      }
    },
  }
}
</script>