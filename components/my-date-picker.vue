<template>
  <v-menu v-model="isVisible">
    <template v-slot:activator="{ props }">
      <!--      v-bind="{...props, ...$attrs}"-->
      <v-text-field
          v-bind="props"
          :model-value="modelValue ? new Date(parseInt(modelValue)).toLocaleDateString() : undefined"
          :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
          :label="label"
          placeholder="дд:мм:гггг"
          density="comfortable"
          variant="outlined"
          color="blue-grey"
          rounded="lg"
          clearable
      />
    </template>

    <v-locale-provider locale="ru">
      <v-date-picker
          v-bind="$attrs"
          :model-value="modelValue ? new Date(parseInt(modelValue)) : undefined"
          @update:modelValue="_value => updateMode(_value)"
          title="Дата регистрации"
          hide-header
          border
      />
    </v-locale-provider>
  </v-menu>
</template>

<script>

export default {

  inheritAttrs: false,

  name: "my-date-picker",

  props: ['modelValue', 'fieldWidth', 'label'],

  emits: ['update:modelValue'],

  data: () => ({
    isVisible: false,
    nowDate: new Date(Date.now())
  }),

  methods: {
    updateMode(_value) {
      this.$emit('update:modelValue', `${Date.parse(_value)}`)
      this.isVisible = false;
    }
  },
}
</script>