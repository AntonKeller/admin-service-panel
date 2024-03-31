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
    >Зарегистрировать</v-btn>

  </v-form>
</template>

<script>
export default {
  name: "c-registration-form",

  methods: {
    click() {
      this.$emit('updateTab', "verify-tab")
    }
  },

  data: () => ({
    emailField: {
      label: 'Почта',
      rules: [
        value => value?.length > 3 || 'Почта введена некорректно'
      ]
    },
    phoneNumberField: {
      label: 'Телефон',
      rules: [
          value => value?.length > 3 || 'Телефон введен некорректно'
      ]
    },
    loginField: {
      label: 'Логин',
      rules: [
          value => value?.length > 3 || 'Логин введен некорректно'
      ]
    },
    passwordField: {
      label: 'Пароль',
      rules: [
          value => value?.length > 3 || 'Пароль введен некорректно'
      ],
      show: false,
    },
  }),
}
</script>

<style scoped>

</style>