<template>
  <div class="index-background">
    <div class="au-panel-wrap">
      <v-card variant="tonal" rounded="lg">

        <v-tabs v-model="currentTab" bg-color="teal-darken-2">
          <v-tab variant="plain" value="authorization-tab" prepend-icon="mdi-login-variant">Вход</v-tab>
<!--          <v-tab variant="plain" value="registration-tab" prepend-icon="mdi-account-multiple-plus-outline">Регистрация</v-tab>-->
        </v-tabs>

        <v-card-text>
          <v-window v-model="currentTab">

            <v-window-item value="authorization-tab">
              <c-auth-form/>
            </v-window-item>

<!--            <v-window-item value="registration-tab">-->
<!--              <c-registration-form @updateTab="setTab"/>-->
<!--            </v-window-item>-->

            <v-window-item value="verify-tab">
              <TheVerifyMenu @updateTab="setTab"/>
            </v-window-item>

          </v-window>
        </v-card-text>

      </v-card>
    </div>
  </div>

</template>

<script>

import CRegistrationForm from "@/components/c-registration-form.vue";

export default {

  name: 'IndexPage',
  components: {
    CRegistrationForm
  },

  data: () => ({

    currentTab: null,
    showVerifyAcc: true,
    show_verify_acc: false,
    otp: '',
    firstName: '',
    lastName: '',
    password: '',
    show1: false,
    show2: true,
    firstNameRules: [v => v?.length > 3 || 'Токен введен неверно',],
    lastNameRules: [v => /[^0-9]/.test(v) || 'Пароль введен неверно',],
  }),

  methods: {
    setTab(v) {
      this.currentTab = v;
    }
  }

}

</script>

<style scoped>
  .index-background {
    background: no-repeat center/cover url("/assets/bg-index-page.png");
    height: 100vh;
    max-height: 100vh;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .au-panel-wrap {
    min-width: 400px;
    max-width: 400px;
    align-self: center;
    justify-self: self-end;
  }
</style>
