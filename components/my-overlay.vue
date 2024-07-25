<template>
  <v-overlay
      v-bind="$attrs"
      class="d-flex justify-center align-center"
      transition="scroll-y-transition"
  >
    <slot/>
  </v-overlay>
</template>

<script>
export default {
  name: "my-overlay"
}
</script>