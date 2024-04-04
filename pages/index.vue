<template>
  <div class="index-background">
    <div class="au-panel-wrap">
      <v-card variant="tonal" class="o-v-card">

        <v-tabs v-model="currentTab" bg-color="primary">
          <v-tab variant="plain" value="authorization-tab" prepend-icon="mdi-account-arrow-left-outline">Вход</v-tab>
          <v-tab variant="plain" value="registration-tab" prepend-icon="mdi-account-multiple-plus-outline">Регистрация</v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="currentTab">

            <v-window-item value="authorization-tab">
              <c-authorization-form/>
            </v-window-item>

            <v-window-item value="registration-tab">
              <c-registration-form @updateTab="setTab"/>
            </v-window-item>

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
  components: {CRegistrationForm},

  watch: {
    currentTab(v) {
      console.log("tab: ", `<${v}>`)
    }
  },

  data: () => ({

    currentTab: null,

    showVerifyAcc: true,
    show_verify_acc: false,

    otp: '',

    firstName: '',

    firstNameRules: [
      value => {
        if (value?.length > 3) return true
        return 'Токен введен неверно'
      },
    ],

    lastName: '',

    lastNameRules: [
      value => {
        if (/[^0-9]/.test(value)) return true
        return 'Пароль введен неверно'
      },
    ],

    show1: false,

    show2: true,

    password: '',

    rules: {
      required: value => !!value || 'Required.',
      min: v => v.length >= 8 || 'Min 8 characters',
      emailMatch: () => (`The email and password you entered don't match`),
    },
  }),

  methods: {
    setTab(v) {
      this.currentTab = v;
    }
  }

}

</script>

<style scoped>
.scroll-hidden::-webkit-scrollbar {
  width: 0;
}

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

.hide {
  transition-delay: 2000ms;
  display: none;
  transform: translateX(-30px);
  opacity: 0;
}

.show {
  transition-delay: 2000ms;
  opacity: 1;
}

</style>
