<template>
  <v-form fast-fail @submit.prevent>

    <v-text-field
        v-model="emailField.value"
        :rules="emailField.rules"
        label="Почта"
    ></v-text-field>

    <v-text-field
        v-model="phoneNumberField.value"
        :rules="phoneNumberField.rules"
        label="Телефон"
    ></v-text-field>

    <v-text-field
        v-model="loginField.value"
        :rules="loginField.rules"
        label="Логин"
    ></v-text-field>

    <v-text-field
        v-model="passwordField.value"
        :append-icon="passwordField.show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordField.rules"
        :type="passwordField.show ? 'text' : 'password'"
        label="Пароль"
        name="input-10-1"
        counter
        @click:append="passwordField.show = !passwordField.show"
    ></v-text-field>

    <v-btn
        prepend-icon="mdi-account-circle"
        class="mt-2"
        type="submit"
        block
        @click="click"
    >Зарегистрировать
    </v-btn>

  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "c-registration-form",

  data: () => ({
    emailField: {
      label: 'Почта',
      value: '',
      rules: [
        value => value?.length > 3 || 'Почта введена некорректно'
      ]
    },
    phoneNumberField: {
      label: 'Телефон',
      value: '',
      rules: [
        value => value?.length > 3 || 'Телефон введен некорректно'
      ]
    },
    loginField: {
      label: 'Логин',
      value: '',
      rules: [
        value => value?.length > 3 || 'Логин введен некорректно'
      ]
    },
    passwordField: {
      label: 'Пароль',
      value: '',
      rules: [
        value => value?.length > 3 || 'Пароль введен некорректно'
      ],
      show: false,
    },
  }),

  methods: {
    click() {
      this.$emit('updateTab', "verify-tab")
    },
    request() {
      axios.post('http://192.168.1.1/registration', {
        email: this.emailField.value,
        phoneNumber: this.phoneNumberField.value,
        login: this.loginField.value,
        password: this.passwordField.value
      }).then((response) => {
        console.log('Запрос на /registration - успешно прошел');
        console.dir('response', response);
        this.$emit('updateTab', "verify-tab");
      }).catch((err) => {
        console.log('Ошибка регистрации по запросу на /registration');
        console.dir('err', err);
      })
    }
  },
}
</script>

<style scoped>

</style>