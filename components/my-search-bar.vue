<template>
  <div class="d-flex ga-2">
    <v-text-field
        v-bind="$attrs"
        color="blue-grey-darken-1"
        prepend-inner-icon="mdi-magnify"
        :append-inner-icon="!hideButton ? 'mdi-plus-box-multiple' : ''"
        @click:appendInner="$emit('btn:click')"
        persistent-hint
        rounded="lg"
        density="compact"
        label="Поиск"
        variant="outlined"
        single-line
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "my-search-bar",
  props: {
    hideButton: Boolean,
  }
}
</script>