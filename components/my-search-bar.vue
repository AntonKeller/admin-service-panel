<template>
  <div class="d-flex ga-2">
    <v-btn
        rounded="lg"
        color="blue-grey-darken-4"
        variant="tonal"
        size="small"
        icon="mdi-plus"
        @click="$emit('btn:click')"
    />
    <v-text-field
        v-bind="$attrs"
        color="blue-grey-lighten-1"
        prepend-inner-icon="mdi-magnify"
        rounded="lg"
        density="compact"
        label="Поиск по задачам"
        variant="outlined"
        single-line
        clearable
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "my-search-bar",
}
</script>