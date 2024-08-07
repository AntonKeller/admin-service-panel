<template>
  <v-form fast-fail @submit.prevent>

    <v-text-field
        density="comfortable"
        v-model="fullName.value"
        :rules="fullName.rules"
        :label="fullName.label"
        :disabled="isLoading"
    />

    <v-text-field
        density="comfortable"
        v-model="organization.value"
        :rules="organization.rules"
        :label="organization.label"
        :disabled="isLoading"
    />

    <v-text-field
        density="comfortable"
        v-model="phoneNumber.value"
        :rules="phoneNumber.rules"
        :label="phoneNumber.label"
        :disabled="isLoading"
    />

    <v-text-field
        density="comfortable"
        v-model="login.value"
        :rules="login.rules"
        :label="login.label"
        :disabled="isLoading"

    />

    <v-text-field
        density="comfortable"
        v-model="password.value"
        :disabled="isLoading"
        :append-icon="password.show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="password.rules"
        :type="password.show ? 'text' : 'password'"
        :label="password.label"
        name="input-10-1"
        counter
        @click:append="password.show = !password.show"
    />

    <v-text-field
        density="comfortable"
        v-model="email.value"
        :rules="email.rules"
        :label="email.label"
        :disabled="isLoading"
    />

    <v-btn
        :loading="isLoading"
        prepend-icon="mdi-account-circle"
        class="mt-2"
        type="submit"
        block
        @click="request"
    >
      Зарегистрировать
    </v-btn>

  </v-form>
</template>

<script>
import {registration} from "../utils/service/server.ts";

export default {
  name: "c-registration-form",

  data: () => ({

    isLoading: false,

    fullName: {
      label: 'ФИО',
      value: 'Воронцов Георгий Глебович',
      rules: [
        value => value?.length > 3 || 'ФИО введено некорректно'
      ]
    },

    organization: {
      label: 'Организация',
      value: 'ИП Воронцов',
      rules: [
        value => value?.length > 3 || 'Организация введена некорректно'
      ]
    },

    phoneNumber: {
      label: 'Телефон',
      value: '8 499 521 21 32',
      rules: [
        value => value?.length > 3 || 'Телефон введен некорректно'
      ]
    },

    login: {
      label: 'Логин',
      value: '',
      rules: [
        value => value?.length > 3 || 'Логин введен некорректно'
      ]
    },

    password: {
      label: 'Пароль',
      value: '',
      rules: [
        value => value?.length > 3 || 'Пароль введен некорректно'
      ],
      show: false,
    },

    email: {
      label: 'Почта',
      value: 'voroncov@mail.ru',
      rules: [
        value => value?.length > 3 || 'Почта введена некорректно'
      ]
    },
  }),

  methods: {
    click() {
      this.$emit('updateTab', "verify-tab")
    },
    request() {

      this.isLoading = true;

      registration({
        fullName: this.fullName.value,
        organization: this.organization.value,
        phoneNumber: this.phoneNumber.value,
        login: this.login.value,
        password: this.password.value,
        email: this.email.value,
      }, 0)
          .then((response) => {
            console.log('Регистрация прошла успешно', response);
            this.$emit('updateTab', "verify-tab");
          })
          .catch((err) => {
            console.log('Ошибка регистрации', err);
          })
          .finally(() => {
            this.isLoading = false;
          });

    }
  },
}
</script>

<style scoped>

</style>