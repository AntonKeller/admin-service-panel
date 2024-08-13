<template>
  <v-text-field
      :model-value="modelValue ? new Date(parseInt(modelValue)).toLocaleDateString() : null"
      :style="fieldWidth ? `width: ${fieldWidth}px` : '' "
      :label="$attrs.label"
      placeholder="дд:мм:гггг"
      density="comfortable"
      variant="outlined"
      color="blue-grey"
      rounded="lg"
      clearable
      @click="show = true"
  >
    <v-overlay
        v-model="show"
        class="d-flex justify-center align-center"
    >
      <v-locale-provider locale="ru">
        <v-date-picker
            border
            :title="$attrs.label"
            :model-value="modelValue ? new Date(parseInt(modelValue)) : null"
            @update:modelValue="_value => this.$emit('update:modelValue', `${Date.parse(_value)}`)"
        />
      </v-locale-provider>
    </v-overlay>
  </v-text-field>
</template>

<script>

export default {

  inheritAttrs: false,

  name: "my-date-picker",

  emits: ['update:modelValue'],

  props: ['modelValue', 'fieldWidth'],

  data: () => ({
    nowDate: new Date(Date.now()),
    show: false,
  }),

}
</script>