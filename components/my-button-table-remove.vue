<template>
  <v-btn
      density="comfortable"
      icon="mdi-close"
      variant="text"
      size="small"
      rounded
      @click.stop="questionIsVisible = true"
      v-bind="$attrs"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="left">
      {{ prompt ? prompt : '...' }}
    </v-tooltip>
    <my-overlay v-model="questionIsVisible">
      <v-sheet class="px-4 py-1 bg-white rounded-lg">
        <v-card-item>
          Хотите удалить запись ?
        </v-card-item>
        <v-card-item>
          <v-divider/>
        </v-card-item>
        <v-card-actions>
          <v-btn
              @click.stop="onclickYes"
              variant="flat"
              density="comfortable"
              class="border-sm rounded-lg"
              text="Да"
          />
          <v-btn
              @click.stop="questionIsVisible=false"
              density="comfortable"
              class="rounded-lg"
              text="Отмена"
          />
        </v-card-actions>
      </v-sheet>
    </my-overlay>
  </v-btn>
</template>

<script>
export default {
  name: "my-button-table-remove",

  props: {
    prompt: String,
  },

  data: () => ({
    questionIsVisible: false,
  }),

  methods: {
    onclickYes(e) {
      this.questionIsVisible = false;
      this.$emit('click:yes');
    }
  }

}
</script>