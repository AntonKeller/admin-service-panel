<template>
  <v-text-field
      v-bind="$attrs"
      :model-value="modelValue ? new Date(parseInt(modelValue)).toLocaleDateString() : undefined"
      @update:modelValue="_value => updateMode(_value)"
      :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
      prepend-inner-icon="mdi-calendar-range"
      color="blue-grey-darken-4"
      density="comfortable"
      variant="outlined"
      placeholder="дд.мм.гггг"
      rounded="sm"
      clearable
      active
  >
    <v-menu v-model="isVisible" activator="parent" transition="slide-x-transition">
      <v-locale-provider locale="ru">
        <v-date-picker
            :model-value="modelValue ? new Date(parseInt(modelValue)) : undefined"
            rounded="sm"
            title="Дата регистрации"
            hide-header
            @click.stop
            border
            @update:modelValue="_value => updateMode(_value)"
        />
      </v-locale-provider>
    </v-menu>
  </v-text-field>
</template>

<script>
export default {
  inheritAttrs: false,

  name: "my-date-picker",
  props: ['modelValue', 'fieldWidth'],
  emits: ['update:modelValue'],

  data: () => ({
    isVisible: false,
  }),

  methods: {
    updateMode(_value) {
      if (_value && !isNaN(Date.parse(_value)) && Date.parse(_value) > 0) {
        console.log('Date.parse(_value)', Date.parse(_value))
        this.$emit('update:modelValue', String(Date.parse(_value)))
        if (this.isVisible) this.isVisible = false;
      } else if (_value || isNaN(Date.parse(_value))) {
        this.$emit('update:modelValue', null)
      } else {

      }
    }
  },
}
</script>