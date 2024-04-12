<template>
  <v-card class="mx-auto" variant="flat" color="indigo-lighten-5" :loading="cardLoading">

    <v-card-title>Список задач</v-card-title>

    <v-card-subtitle>
      <div class="d-flex ga-2">
        {{ userName }}
        <span
            v-for="chip of chips"
            :key="chip.id"
            class="d-inline-block"
        >
          <v-chip
              density="compact"
              size="small"
              variant="text"
              :color="chip.color"
              rounded="sm"
          >{{ chip.title }}</v-chip>
        </span>
        <div class="ml-auto">
          <v-btn
              rounded="sm"
              color="blue-grey-darken-3"
              variant="elevated"
              density="default"
              size="small"
              icon="mdi-plus"
              @click="addTask"
          />
        </div>
      </div>
    </v-card-subtitle>

    <v-card-text>

      <span v-show="tasks?.length === 0">Список задач пуст</span>

      <v-skeleton-loader
          width="full"
          color="transparent"
          elevation="0"
          v-if="cardLoading"
          type="list-item-three-line"
      />

      <v-list
          width="512"
          max-height="460"
          density="compact"
          lines="one"
          variant="text"
          bg-color="transparent"
      >
        <v-list-item
            v-for="task of tasks"
            :key="task.id"
        >
          <c-card-user-task
              :title="task.title"
              :customer-label="task.address"
              :comments="task.description"
          />
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-overlay @addNewTask="addNewTask" v-model="addTaskOverlay" class="d-flex justify-center align-center">
      <c-user-task-add-overlay />
    </v-overlay>

  </v-card>
</template>

<script>

import axios from "axios";
import {serverURL} from "@/constants/constants";

export default {
  name: "c-user-tasks-overlay",
  // components: {CCardUserTask},
  props: {
    user: Object
  },

  data: () => ({

    addTaskOverlay: false,

    chips: [
      {id: 1, color: 'blue', title: 'Активных '},
      {id: 2, color: 'teal', title: 'Завершенных '},
    ],

    actions: [
      {id: 1, icon: 'mdi-pencil', title: 'Изменить'},
      {id: 2, icon: 'mdi-check', title: 'Завершить'},
      {id: 3, icon: 'mdi-close', title: 'Снять'},
    ],

    tasks: [],

    cardLoading: true,
  }),

  mounted() {
    this.fetchTasks(1);
  },

  methods: {

    addNewTask(task) {
      this.tasks.push(task);
      this.overlay = false;
    },

    addTask() {
      this.addTaskOverlay = true;
    },

    fetchTasks(id) {
      this.cardLoading = true;
      axios.get(serverURL + '/tasks/tasks-by-user/?userId=' + id, {timeout: 1000})
          .then(response => {
            console.log('Задачи успешно получены');
            this.tasks = response?.data;
          })
          .catch(err => {
            console.log('Ошибка получения задач', err);
            this.tasks = [
              {
                id: 1,
                title: 'Осмотр кранов',
                address: 'Дек. 26',
                description: 'Ленина 7, к.2, с.1, офис 4',
                complete: false,
                color: 'blue-grey-darken-2'
              },
              {
                id: 2,
                title: 'Осмотр складов',
                address: 'Янв. 13',
                description: 'Кирова 4, к.2, с.6',
                complete: false,
                color: 'blue-grey-darken-2'
              },
              {
                id: 3,
                title: 'Осмотр машин',
                address: 'Мар. 1',
                description: 'Паперника 1, дом 6, корпус 4',
                complete: true,
                color: 'teal-darken-1'
              },
              {
                id: 3,
                title: 'Осмотр компьютерной техники',
                address: 'Апр. 8',
                description: 'Кирова 19, дом 1',
                complete: true,
                color: 'teal-darken-1'
              },
              {
                id: 3,
                title: 'Осмотр Еще чего-то там..',
                address: 'Какого-то',
                description: 'Како-то адр.',
                complete: true,
                color: 'teal-darken-1'
              }
            ]
          })
          .finally(() => {
            this.cardLoading = false;
          })
    }

  }

}
</script>

<style scoped>
  .scroll-hidden::-webkit-scrollbar {
    width: 0;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #B0BEC5;
    /*box-shadow: inset 0 0 5px #B39DDB;*/
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #546E7A;
    border-radius: 6px;
  }
</style>