<template>
  <v-btn
      v-bind="$attrs"
      variant="tonal"
      icon="mdi-pencil-outline"
      density="comfortable"
      border="sm"
      color="blue-grey-darken-2"
      rounded="lg"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="top">
      {{ prompt ? prompt : '...' }}
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: "c-btn-change",
  props: {
    prompt: String,
  },
}
</script>