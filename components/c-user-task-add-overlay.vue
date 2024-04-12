<template>
  <v-card density="compact" rounded="sm" variant="elevated" min-width="360">
    <v-card-title>
      Новая задача
    </v-card-title>
    <v-card-subtitle>{{ Date().toString() }}</v-card-subtitle>
    <v-card-text>
      <v-text-field v-model="task.taskType" clearable density="compact" variant="outlined" color="blue"
                    label="Заголовок"/>
      <v-text-field v-model="task.object" clearable density="compact" variant="outlined" color="blue" label="Описание"/>
    </v-card-text>
    <v-card-actions>
      <v-btn
          rounded="sm"
          color="blue-grey-darken-3"
          variant="tonal"
          density="default"
          size="small"
          @click="fetchUsers"
      >Добавить
      </v-btn>
      <v-btn
          rounded="sm"
          color="blue-grey-darken-3"
          variant="tonal"
          density="default"
          size="small"
      >Отменить
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>

import axios from "axios";
import {serverURL} from "@/constants/constants";

export default {
  name: "c-user-task-add-overlay",

  props: ['addNewTask'],

  data: () => ({
    task: {
      taskType: null,
      object: null,
      phoneNumber: '8-954-563-25-55'
    }
  }),

  methods: {

    doSomething() {
      this.$emit('addTaskOverlay', this.task)
    },

    fetchUsers() {
      axios.post(serverURL + '/tasks/0f4f1e36-ee6a-4a07-8393-04c97f0e4c8a/add-task', this.task)
          .then((response) => {
            console.log('Задача успешно добавлена', response?.data);
            // this.doSomething();
          })
          .catch((err) => {
            console.log('Ошибка добавления задачи', err);

          })
          .finally(() => {

          });
    },
  }
}
</script>

<style scoped>

</style>