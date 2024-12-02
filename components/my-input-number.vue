<template>
  <v-text-field
      :model-value="modelValue"
      @update:modelValue="update"
      label="Номер телефона, 8-xxx-xxx-xx-xx"
      color="yellow-darken-3"
      variant="outlined"
      density="compact"
      clearable
  />
</template>

<script>
export default {
  name: "my-input-number",
  props: {
    modelValue: String,
  },
  emits: ['update:modelValue'],   
  methods: {
    inputValidator() {

    },
    update(value) {
      console.log('emit value:', value);
      this.$emit('update:modelValue', '0000');
    }
  }
}
</script>