<template>
  <v-text-field
      color="yellow-darken-3"
      variant="outlined"
      density="compact"
      label="Заголовок задания"
      :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
      clearable
      v-bind="$attrs"
  />
</template>

<script>
export default {
  name: "my-text-field",
  props: ['fieldWidth'],
}
</script>