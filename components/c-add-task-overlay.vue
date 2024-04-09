<template>
  <v-card density="compact"  rounded="sm" variant="elevated" min-width="360">
    <v-card-title>
      Новая задача
    </v-card-title>
    <v-card-subtitle>{{Date().toString()}}</v-card-subtitle>
    <v-card-text>
      <v-text-field clearable density="compact" variant="outlined" color="blue" label="Заголовок" />
      <v-text-field clearable density="compact" variant="outlined" color="blue" label="Время" />
      <v-text-field clearable density="compact" variant="outlined" color="blue" label="Описание" />
      <v-text-field clearable density="compact" variant="outlined" color="blue" label="Описание" />
    </v-card-text>
    <v-card-actions>
      <v-btn
          rounded="sm"
          color="blue-grey-darken-3"
          variant="tonal"
          density="default"
          size="small"
      >Добавить</v-btn>
      <v-btn
          rounded="sm"
          color="blue-grey-darken-3"
          variant="tonal"
          density="default"
          size="small"
      >Отменить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  name: "c-add-task-overlay",

}
</script>

<style scoped>

</style>