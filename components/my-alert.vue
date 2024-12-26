<template>
  <v-snackbar v-model="visible" :color="color">
    <v-icon>mdi-alert-circle-outline</v-icon>
    <span class="ml-3">{{ message }}</span>
  </v-snackbar>
</template>

<script>
export default {
  name: "my-alert",
  computed: {
    color() {
      return this.$store.getters['alert/GET_TYPE'];
    },
    message() {
      return this.$store.getters['alert/GET_MESSAGE'];
    },
    visible: {
      get() {
        return this.$store.getters['alert/GET_VISIBLE'];
      },
      set(value) {
        this.$store.commit('alert/SET_VISIBLE', value);
      }
    },
  }
}
</script>