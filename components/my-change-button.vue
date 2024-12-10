<template>
  <v-btn
      class="align-self-start"
      density="comfortable"
      color="blue-darken-3"
      icon="mdi-pencil"
      variant="text"
      rounded="lg"
      size="small"
      v-bind="$attrs"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="left">
      {{prompt}}
    </v-tooltip>
  </v-btn>
</template>

<script>
export default {
  name: "my-change-button",
  props: {
    prompt: String,
  }
}
</script>