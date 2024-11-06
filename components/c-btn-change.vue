<template>
  <v-btn
      v-bind="$attrs"
      variant="text"
      icon="mdi-pencil"
      density="compact"
      class="d-inline"
      :rounded="0"
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