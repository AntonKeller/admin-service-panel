<template>
  <div class="d-flex ga-2">
    <v-btn
        v-if="!hideButton"
        icon="mdi-plus"
        size="small"
        rounded
        color="blue-darken-1"
        @click="$emit('btn:click')">
    </v-btn>
    <v-text-field
        color="blue-grey-darken-1"
        class="border-t"
        prepend-inner-icon="mdi-magnify"
        persistent-hint
        rounded="md"
        density="compact"
        label="Поиск"
        variant="solo"
        single-line
        v-bind="$attrs">
    </v-text-field>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "my-search-bar",
  emits: ['btn:click'],
  props: {
    hideButton: Boolean,
  }
}
</script>