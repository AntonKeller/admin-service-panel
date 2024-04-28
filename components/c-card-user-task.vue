<template>
  <v-card
      rounded="lg"
      density="compact"
      color="indigo"
      variant="tonal"
  >
    <v-card-title>
      <v-avatar color="indigo" rounded="lg" density="compact" variant="text">
        <v-icon size="large" color="indigo">mdi-home-search</v-icon>
      </v-avatar>
      {{title}}
    </v-card-title>
    <v-card-subtitle>{{customerLabel}}</v-card-subtitle>
    <v-card-text>{{comments}}</v-card-text>
    <v-card-actions>
      <v-btn
          v-for="action of actions"
          :key="action.id"
          :icon="action.icon"
          rounded="lg"
          color="indigo"
          variant="elevated"
          density="comfortable"
          size="small"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {

  name: "c-card-user-task",

  props: {
    title: String,
    customerLabel: String,
    comments: String
  },

  data: () => ({
    actions: [
      {id: 1, icon: 'mdi-pencil', title: 'Изменить'},
      {id: 2, icon: 'mdi-check', title: 'Завершить'},
      {id: 3, icon: 'mdi-close', title: 'Снять'},
    ],
  })

}
</script>