<template>
  <v-text-field
      v-bind="$attrs"
      color="yellow-darken-3"
      variant="outlined"
      density="compact"
      label="Заголовок задания"
      :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
      clearable
  />
</template>

<script>
export default {
  name: "my-text-field",
  props: ['fieldWidth'],
}
</script>