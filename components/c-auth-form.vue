<template>
  <div class="d-flex flex-column justify-center align-center h-100">

    <div class="d-flex flex-column justify-start">
      <p class="text-h4 font-weight-bold">
        Добро пожаловать в
        <span class="text-blue-darken-4">Панель управления</span>
      </p>
      <v-form @submit.prevent class="d-flex flex-column ga-1 mt-8" style="width: 340px">
        <v-text-field
            :disabled="isLoading"
            label="Логин"
            density="compact"
            variant="outlined"
            rounded="sm"
            prepend-inner-icon="mdi-account-outline"
            v-model="login.value"
            :rules="login.rules"
        />

        <v-text-field
            :disabled="isLoading"
            label="Пароль"
            density="compact"
            variant="outlined"
            rounded="sm"
            v-model="password.value"
            prepend-inner-icon="mdi-lock-outline"
            :rules="password.rules"
            :type="password.isPassword ? 'password' : 'text'"
            :append-icon="!password.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
            name="input-10-1"
            @click:append="password.isPassword = !password.isPassword"
        />

        <v-btn
            class="mt-2"
            prepend-icon="mdi-login-variant"
            color="blue-darken-4"
            variant="elevated"
            text="Войти"
            rounded="sm"
            block
            :loading="isLoading"
            @click="auth"
        />

        <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
          <v-icon>mdi-alert-circle-outline</v-icon>
          {{ snackBar.msg }}
        </v-snackbar>

      </v-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {serverURL} from "../constants/constants";
import {reloadNuxtApp} from "nuxt/app";

export default {
  name: "c-auth-form",

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