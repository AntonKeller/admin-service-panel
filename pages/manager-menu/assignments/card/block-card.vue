<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateBack"
  >
    <component-block-card/>
  </v-overlay>
</template>

<script>
export default {
  name: "block-card-page",

  data() {
    return {
      visibility: false,
    }
  },

  mounted() {
    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);
  },

  methods: {
    navigateBack() {
      navigateTo('/manager-menu/assignments/card');
    }
  }
}
</script>