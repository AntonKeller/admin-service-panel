<template>
  <v-form @submit.prevent class="d-flex flex-column ga-2 pt-2">
    <v-text-field
        :disabled="isLoading"
        label="Логин"
        density="comfortable"
        variant="outlined"
        rounded="lg"
        prepend-inner-icon="mdi-account-outline"
        v-model="login.value"
        :rules="login.rules"
    />

    <v-text-field
        :disabled="isLoading"
        label="Пароль"
        density="comfortable"
        variant="outlined"
        rounded="lg"
        v-model="password.value"
        prepend-inner-icon="mdi-lock-outline"
        :rules="password.rules"
        :type="password.isPassword ? 'password' : 'text'"
        :append-icon="!password.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
        name="input-10-1"
        @click:append="password.isPassword = !password.isPassword"
    />

    <v-btn
        :loading="isLoading"
        block
        text="Войти"
        variant="tonal"
        rounded="lg"
        prepend-icon="mdi-login-variant"
        @click="auth"
    />

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-form>
</template>

<script>
import axios from "axios";
import {serverURL} from "../constants/constants";
import {reloadNuxtApp} from "nuxt/app";

export default {
  name: "c-authorization-form",

  data: () => ({
    snackBar: {},
    isLoading: false,

    login: {
      value: "",
      rules: [
        value => value?.length > 3 ? true : 'Логин введен неверно',
      ],
    },

    password: {
      showIcon: false,
      isPassword: true,
      value: "",
      rules: [
        value => value?.length > 3 ? true : 'Пароль введен неверно',
      ],
    },

  }),

  methods: {

    auth() {

      this.isLoading = true;

      axios.post(serverURL + '/auth/login', {
        login: this.login.value,
        password: this.password.value,
      }).then(async (response) => {

        localStorage.setItem("accessToken", JSON.stringify({
          accessToken: response.data.accessToken
        }));

        reloadNuxtApp();

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