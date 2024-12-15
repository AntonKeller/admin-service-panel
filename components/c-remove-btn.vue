<template>
  <v-btn
      class="d-inline"
      icon="mdi-progress-close"
      rounded
      variant="text"
      color="red-darken-4"
      density="compact"
      v-bind="$attrs"
      @click.stop="questionIsVisible = true"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="left">
      {{ prompt ? prompt : '...' }}
    </v-tooltip>

    <my-overlay v-model="questionIsVisible">
      <v-card color="red-darken-4" rounded="sm">
        <v-card-text>
          <v-icon>mdi-progress-question</v-icon>
          <span class="ml-2">Хотите удалить запись ?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="onclickYes" variant="elevated" text="Да"/>
          <v-btn @click.stop="questionIsVisible=false" text="Отмена"/>
        </v-card-actions>
      </v-card>
    </my-overlay>
  </v-btn>
</template>

<script>
export default {
  name: "c-remove-btn",

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