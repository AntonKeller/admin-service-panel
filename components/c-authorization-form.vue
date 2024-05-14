<template>
  <div>
    <!--    action="http://127.0.0.1:3000/produtos"-->
    <v-form @submit.prevent fast-fail method="POST">
      <v-text-field
          @input="loginErrMsg=''"
          :disabled="isLoading"
          label="Логин"
          v-model="login.value"
          :rules="login.rules"
      ></v-text-field>

      <v-text-field
          @input="loginErrMsg=''"
          :disabled="isLoading"
          label="Пароль"
          v-model="password.value"
          :rules="password.rules"
          :type="password.isPassword ? 'password' : 'text'"
          :append-icon="!password.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
          name="input-10-1"
          counter
          @click:append="password.isPassword = !password.isPassword"
      />

      <v-label :text="loginErrMsg" class="text-red-accent-4"/>

      <v-btn :loading="isLoading" @click="request" class="mt-2" block>Войти</v-btn>
    </v-form>
  </div>

</template>

<script>
import axios from "axios";
import {serverURL} from "../constants/constants";

export default {
  name: "c-authorization-form",

  data: () => ({
    loginErrMsg: '',
    isLoading: false,

    login: {
      value: "voroncov123",
      rules: [
        value => value?.length > 3 ? true : 'Логин введен неверно',
      ],
    },

    password: {
      showIcon: false,
      isPassword: true,
      value: "voroncov123",
      rules: [
        value => value?.length > 3 ? true : 'Пароль введен неверно',
      ],
    },

  }),

  created() {
    this.readTokenInStorage();
  },

  methods: {

    readTokenInStorage() {
      if (localStorage.getItem("accessToken")) {
        // JSON.parse(localStorage.getItem("accessToken"))
        navigateTo('/manager-menu/assignments')
      }
    },

    writeTokenInStorage(tokenBlock) {
      localStorage.setItem("accessToken", JSON.stringify(tokenBlock));
    },

    request() {

      this.isLoading = true;

      axios.post(serverURL + '/auth/login', {
        login: this.login.value,
        password: this.password.value,
      }).then(async (response) => {
        this.loginErrMsg = '';
        this.writeTokenInStorage(response.data);
        console.log('Успешная авторизация', response);
        // await navigateTo('/manager-menu/assignments');
      }).catch((err) => {
        console.log('Ошибка авторизации', err);
        this.loginErrMsg = 'Ошибка авторизации';
      }).finally(() => {
        this.isLoading = false;
      });

    },
  }

}
</script>