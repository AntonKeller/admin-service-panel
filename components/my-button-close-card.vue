<template>
  <v-btn
      density="comfortable"
      color="red-darken-4"
      icon="mdi-close"
      variant="text"
      rounded="lg"
      size="small"
  >
    <v-icon />
    <v-tooltip activator="parent" location="left">
      Закрыть окно
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: "my-button-close-card",
}
</script>