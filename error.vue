<template>
  <v-sheet class="d-flex align-center justify-center bg-blue-grey-lighten-4" height="100vh">
    <v-card color="blue-grey-lighten-5" elevation="6" width="420px" rounded="sm">
      <v-card-title>
        <v-icon color="orange-darken-4">mdi-alert-outline</v-icon>
        <!--        <span class="ml-6">Что-то пошло не так...</span>-->
        <span class="ml-6">Ведем технические работы...</span>
      </v-card-title>
    </v-card>
  </v-sheet>
</template>

<script>
import {clearError} from "nuxt/app";

export default {
  name: "error",
  methods: {
    back() {
      clearError({redirect: '/'})
    }
  }
}
</script>