<template>
  <div class="d-flex ga-2">
    <v-btn
        v-if="!hideButton"
        icon="mdi-plus"
        size="small"
        rounded
        color="blue-darken-1"
        @click:appendInner="$emit('btn:click')">
    </v-btn>
    <v-text-field
        v-bind="$attrs"
        color="blue-grey-darken-1"
        prepend-inner-icon="mdi-magnify"
        persistent-hint
        rounded="md"
        density="compact"
        label="Поиск"
        variant="outlined"
        single-line>
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