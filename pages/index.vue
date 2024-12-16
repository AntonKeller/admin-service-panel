<template>
  <div class="d-flex align-center justify-center h-100">
    <c-auth-form/>
  </div>
</template>

<script>

export default {

  name: 'IndexPage',

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
    firstNameRules: [v => v?.length > 3 || 'Токен введен неверно'],
    lastNameRules: [v => /[^0-9]/.test(v) || 'Пароль введен неверно'],
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
