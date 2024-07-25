<template>
  <v-text-field
      v-bind="$attrs"
      density="comfortable"
      variant="filled"
      label="Заголовок задания"
      clearable
  />
</template>

<script>
export default {
  name: "c-my-form-input",
}
</script>