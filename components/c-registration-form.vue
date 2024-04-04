<template>
  <v-form fast-fail @submit.prevent>

    <v-text-field
        :disabled="isLoading"
        v-model="emailField.value"
        :rules="emailField.rules"
        label="Почта"
    ></v-text-field>

    <v-text-field
        :disabled="isLoading"
        v-model="phoneNumberField.value"
        :rules="phoneNumberField.rules"
        label="Телефон"
    ></v-text-field>

    <v-text-field
        :disabled="isLoading"
        v-model="loginField.value"
        :rules="loginField.rules"
        label="Логин"
    ></v-text-field>

    <v-text-field
        :disabled="isLoading"
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
        :loading="isLoading"
        prepend-icon="mdi-account-circle"
        class="mt-2"
        type="submit"
        block
        @click="request"
    >Зарегистрировать
    </v-btn>

  </v-form>
</template>

<script>
import axios from "axios";

export default {
  name: "c-registration-form",

  data: () => ({

    isLoading: false,

    emailField: {
      label: 'Почта',
      value: '123@mail.ru',
      rules: [
        value => value?.length > 3 || 'Почта введена некорректно'
      ]
    },
    phoneNumberField: {
      label: 'Телефон',
      value: '123',
      rules: [
        value => value?.length > 3 || 'Телефон введен некорректно'
      ]
    },
    loginField: {
      label: 'Логин',
      value: '123',
      rules: [
        value => value?.length > 3 || 'Логин введен некорректно'
      ]
    },
    passwordField: {
      label: 'Пароль',
      value: '123',
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

      this.isLoading = true;

      axios.post('http://192.168.1.26/registration', {
        email: this.emailField.value,
        phoneNumber: this.phoneNumberField.value,
        login: this.loginField.value,
        password: this.passwordField.value
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*'
        }
      }).then((response) => {
        console.log('Регистрация прошла успешно', response);
        this.$emit('updateTab', "verify-tab");
      }).catch((err) => {
        console.log('Ошибка регистрации', err);
      }).finally(() => {
        this.isLoading = false;
      })
    }
  },
}
</script>

<style scoped>

</style>