<template>
  <v-btn
      density="comfortable"
      icon="mdi-close"
      variant="text"
      size="small"
      rounded
      v-bind="$attrs"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="left">
      {{ prompt ? prompt : '...' }}
    </v-tooltip>

    <v-menu activator="parent" location="top right" width="205">
      <v-sheet class="elevation-0 rounded-lg border-sm px-4 py-3">
        <div>Подтвердите удаление</div>
        <v-divider class="my-3 "/>
        <div class="d-flex align-center ga-1">
          <v-btn
              density="comfortable"
              class="rounded-lg"
              variant="flat"
              size="small"
              border="sm"
              text="Ок"
              @click="onclickYes"
          />
          <v-btn
              density="comfortable"
              class="rounded-lg"
              variant="flat"
              size="small"
              text="Отмена"
          />
        </div>
      </v-sheet>
    </v-menu>
  </v-btn>
</template>

<script>
export default {
  name: "my-button-table-remove",

  props: {
    prompt: String,
  },

  methods: {
    onclickYes() {
      this.questionIsVisible = false;
      this.$emit('click:yes');
    }
  }

}
</script>