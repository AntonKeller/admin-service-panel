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
import {authorization} from "../utils/methods/requests";

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

  methods: {

    request() {

      this.isLoading = true;
      const router = useRouter()

      authorization({
        login: this.login.value,
        password: this.password.value,
      }, 100)
          .then((response) => {
            console.log('Успешная авторизация', response);
            this.loginErrMsg = '';
            router.push("/manager-menu");
          })
          .catch((err) => {
            console.log('Ошибка авторизации', err);
            this.loginErrMsg = 'Ошибка авторизации';
          })
          .finally(() => {
            this.isLoading = false;
          });

    },
  }

}
</script>

<style scoped>

</style>