<template>
  <v-btn
      v-bind="$attrs"
      rounded="lg"
      variant="text"
      color="blue-darken-4"
      prepend-icon="mdi-backspace-outline"
  />
</template>

<script>
export default {
  name: "my-btn-clear",
}
</script>