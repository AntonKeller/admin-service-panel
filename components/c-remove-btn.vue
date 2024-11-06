<template>
  <v-btn
      v-bind="$attrs"
      class="d-inline"
      icon="mdi-progress-close"
      rounded
      variant="text"
      color="red-darken-4"
      density="compact"
      @click.stop="questionIsVisible = true"
  >
    <v-icon/>
    <v-tooltip activator="parent" location="top">
      {{ prompt ? prompt : '...' }}
    </v-tooltip>

    <my-overlay v-model="questionIsVisible">
      <v-card color="yellow-lighten-3" density="compact" rounded="sm">
        <v-card-text>
          <v-icon>mdi-progress-question</v-icon>
          <span class="ml-2">Подтвердите удаление</span>
        </v-card-text>
        <v-card-actions>
          <v-btn
              @click="onclickYes"
              variant="tonal"
              rounded="sm"
          >
            Подтвердить
          </v-btn>
          <v-btn
              @click="questionIsVisible=false"
              rounded="sm"
          >
            Отменить
          </v-btn>
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
      e.preventDefault;
      this.questionIsVisible = false;
      this.$emit('click:yes');
    }
  }

}
</script>