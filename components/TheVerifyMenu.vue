<template>
  <v-card

      class="py-8 px-6 text-center mx-auto ma-4"
      elevation="6"
      max-width="400"
  >
    <h3 class="text-h6 mb-4">Верификация аккаунта</h3>

    <div class="text-body-2">
      Мы отправили код подтверждения на адрес
      <span style="color:blue; font-weight: bold; opacity: 0.5">john..@gmail.com</span>
      Пожалуйста, проверьте свою электронную почту и вставьте код ниже.
    </div>

    <v-sheet color="surface">
      <v-otp-input
          v-model="otp"
          type="password"
          :loading="isLoading"
      ></v-otp-input>
    </v-sheet>

    <v-btn
        class="my-4"
        color="primary"
        height="40"
        text="Подтвердить"
        variant="flat"
        width="70%"
        @click="click"
    ></v-btn>

    <div class="text-caption">
      Не пришел код? <a href="#" @click.prevent="otp = ''">Отправить снова</a>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "TheVerifyMenu",

  props: {
    show: true,
  },

  data: () => ({
    otp: '',
    isLoading: false,
  }),

  methods: {
    click() {

      this.isLoading = !this.isLoading;

      let timeout = setTimeout(() => {
        this.isLoading = false;
        this.$emit('updateTab', "authorization-tab") // - переход к авторизации
        clearTimeout(timeout);
      }, 1500);
    }
  },
}
</script>

<style scoped>

</style>