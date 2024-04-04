<template>
  <div>
    <!--    action="http://127.0.0.1:3000/produtos"-->
    <v-form @submit.prevent fast-fail method="POST">
      <v-text-field
          @input="loginErrMsg=''"
          :disabled="isLoading"
          label="Логин"
          v-model="loginField.value"
          :rules="loginField.rules"
      ></v-text-field>

      <v-text-field
          @input="loginErrMsg=''"
          :disabled="isLoading"
          label="Пароль"
          v-model="passwordField.value"
          :rules="passwordField.rules"
          :type="passwordField.isPassword ? 'password' : 'text'"
          :append-icon="!passwordField.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
          name="input-10-1"
          counter
          @click:append="passwordField.isPassword = !passwordField.isPassword"
      />

      <v-label :text="loginErrMsg" class="text-red-accent-4"/>

      <v-btn :loading="isLoading" @click="request" class="mt-2" block>Войти</v-btn>
    </v-form>
  </div>

</template>

<script>

import axios from 'axios'

export default {
  name: "c-authorization-form",

  data: () => ({

    loginErrMsg: '',
    isLoading: false,

    loginField: {
      value: "lgonlogon123",
      rules: [
        value => value?.length > 3 ? true : 'Логин введен неверно',
      ],
    },

    passwordField: {
      showIcon: false,
      isPassword: true,
      value: "1233219872167324fdgdfg",
      rules: [
        value => value?.length > 3 ? true : 'Пароль введен неверно',
      ],
    },

  }),

  methods: {

    request() {

      this.isLoading = true;

      axios.post('http://192.168.1.26/login', {
        loginOrEmail: this.loginField.value,
        password: this.passwordField.value
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*'
        }
      }).then((response) => {
        this.loginErrMsg = '';
        console.dir('Успешная авторизация', response);
        this.openUserMenu();
      }).catch((err) => {
        console.log('Ошибка авторизации', err);
        this.loginErrMsg = 'Ошибка авторизации';
      }).finally(() => {
        this.isLoading = false;
      });

    },

    openUserMenu() {
      this.isLoading = true;
      // const router = useRouter()
      // router.push("/user-menu");
      let timeout = setTimeout(() => {
        const router = useRouter()
        router.push("/user-menu");
        clearTimeout(timeout);
      }, 2500);
    }
  }

}
</script>

<style scoped>

</style>