<template>
  <v-text-field
      v-bind="$attrs"
      rounded="lg"
      color="blue-grey-darken-3"
      variant="outlined"
      density="comfortable"
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