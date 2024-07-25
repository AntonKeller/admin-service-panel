<template>
  <div class="d-flex ga-2">
    <v-btn
        rounded="lg"
        color="blue-grey-darken-2"
        variant="elevated"
        size="small"
        icon="mdi-plus"
        @click="$emit('btn:click')"
    />
    <v-text-field
        v-bind="$attrs"
        color="blue-grey-darken-2"
        prepend-inner-icon="mdi-magnify"
        density="compact"
        label="Поиск по задачам"
        variant="outlined"
        hide-details
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