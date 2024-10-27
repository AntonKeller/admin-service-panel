<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateTo('/manager-menu/assignments/card')"
  >
    <assignment-block-add />
  </v-overlay>
</template>

<script>
export default {
  name: "block-add-page",

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

}
</script>