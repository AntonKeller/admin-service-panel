<template>
  <div>
    <!--    action="http://127.0.0.1:3000/produtos"-->
    <v-form @submit.prevent fast-fail method="POST">
      <v-text-field
          @input="this.loginErrMsg = ''"
          :loading="isLoading"
          label="Логин"
          v-model="config.params.login"
          :rules="loginField.rules"
      ></v-text-field>

      <v-text-field
          @input="this.loginErrMsg = ''"
          :loading="isLoading"
          label="Пароль"
          v-model="config.params.password"
          :rules="passwordField.rules"
          :type="passwordField.isPassword ? 'password' : 'text'"
          :append-icon="!passwordField.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
          name="input-10-1"
          counter
          @click:append="passwordField.isPassword = !passwordField.isPassword"
      />

      <v-label :text="loginErrMsg" class="text-red-accent-4"/>

      <v-btn @click="request" class="mt-2" block>Войти</v-btn>
    </v-form>
  </div>

</template>

<script>

import {serverURL} from "../constants/constants"
import axios from 'axios'

export default {
  name: "c-authorization-form",

  data: () => ({

    loginErrMsg: 'Ошибка авторизации',
    isLoading: false,

    loginField: {
      value: "",
      rules: [
        value => value?.length > 3 ? true : 'Логин введен неверно',
      ],
    },

    passwordField: {
      showIcon: false,
      isPassword: true,
      value: "",
      rules: [
        value => value?.length > 3 ? true : 'Пароль введен неверно',
      ],
    },

    config: {
      url: '/users',
      // method: 'get', // значение по умолчанию
      // baseURL: 'http' + '://' + serverURL,
      params: {
        login: '',
        password: '',
      },
    }
  }),

  methods: {

    request() {
      console.log('login', this.config.params.login)
      console.log('password', this.config.params.password)

      axios.get('https://jsonplaceholder.typicode.com/users')
          .then((response) => {
            console.dir('response', response);
            this.openUserMenu();
          })
          .catch((err) => {
            console.dir('err', err);
            this.loginErrMsg = 'Ошибка авторизации';
          })


      // http://127.0.0.1:3000/produtos
      // Make a request for a user with a given ID
      // axios.get('/user?ID=12345')
      //     .then(function (response) {
      //       console.log(response);
      //     })
      //     .catch(function (error) {
      //       console.log(error);
      //     });
      // axios.get('/user', {
      //   params: {
      //     ID: 12345
      //   }
      // })
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