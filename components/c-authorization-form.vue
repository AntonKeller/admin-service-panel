<template>
  <div>
    <v-form fast-fail method="POST" action="http://127.0.0.1:3000/produtos">
      <v-text-field
          label="Логин"
          v-model="loginField.value"
          :rules="loginField.rules"
      ></v-text-field>

      <v-text-field
          label="Пароль"
          v-model="passwordField.value"
          :rules="passwordField.rules"
          :type="passwordField.isPassword ? 'password' : 'text'"
          :append-icon="!passwordField.isPassword ? 'mdi-eye' : 'mdi-eye-off'"
          name="input-10-1"
          counter
          @click:append="passwordField.isPassword = !passwordField.isPassword"
      />

      <v-btn class="mt-2" type="submit" block>Войти</v-btn>
    </v-form>
  </div>

</template>

<script>
export default {
  name: "c-authorization-form",

  data: () => ({
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
    }
  }),

}
</script>

<style scoped>

</style>