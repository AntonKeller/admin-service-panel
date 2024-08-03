<template>
  <v-menu
      v-model="isVisible"
      transition="scale-transition"
  >
    <template v-slot:activator="{ props }">
      <v-text-field
          v-bind="{...props, ...$attrs}"
          variant="outlined"
          rounded="lg"
          density="comfortable"
          color="blue-grey"
          clearable
          :model-value="modelValue ? new Date(parseInt(modelValue)).toLocaleDateString() : undefined"
      />
    </template>

    <v-locale-provider locale="ru">
      <v-date-picker
          v-bind="$attrs"
          hide-header
          border
          @click.stop
          title="Дата регистрации"
          :model-value="modelValue ? new Date(parseInt(modelValue)) : undefined"
          @update:modelValue="_value => updateMode(_value)"
      />
    </v-locale-provider>
  </v-menu>
</template>

<script>
export default {
  name: "my-date-picker",
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data: () => ({
    isVisible: false,
    nowDate: new Date(Date.now())
  }),
  methods: {
    updateMode(_value) {
      this.$emit('update:modelValue', String(Date.parse(_value)))
      this.isVisible = false;
    }
  },
}
</script>