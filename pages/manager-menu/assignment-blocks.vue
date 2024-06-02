<template>
  <v-sheet>
    <v-card color="teal-darken-1" class="mx-auto" variant="text">

      <v-card-title>Блоки задач</v-card-title>

      <v-card-item>
        <div class="d-flex ga-2">
          <v-text-field
              color="teal-darken-1"
              prepend-inner-icon="mdi-magnify"
              density="compact"
              label="Поиск по задачам"
              variant="outlined"
              hide-details
              single-line
              clearable
              v-model="searchText"
          />
        </div>
      </v-card-item>
    </v-card>

    <v-container fluid>

      <v-row dense>
        <v-col lg="3" v-for="status of statuses" class="d-flex flex-column ga-2">

          <v-card
              density="compact"
              elevation="2"
              variant="elevated"
              :color="status.color"
          >
            <v-card-item>
              <div class="d-flex justify-space-between">
                <div>{{ status.value }}</div>
                <div>{{ blocksCount(status.value) }}</div>
              </div>
            </v-card-item>
          </v-card>

          <v-card
              @click="console.log('Click on block')"
              v-for="block of getBlocksByStatus(status.value)"
              :key="block.assignmentBlock._id"
              :color="Date.now() > block.assignmentBlock.endDate ? 'red-lighten-4' : ''"
          >
            <v-card-item>
              {{ block.assignmentBlock.title }}
            </v-card-item>

            <v-card-subtitle>
              <div>Дедлайн: <b>{{ getDateTime(block.assignmentBlock.endDate) }}</b></div>
              <div>Номер договора: <b>{{ block.contract.contractNumber }}</b></div>
              <div>Исполнитель: <b>{{ block.executor.fullName }}</b></div>
            </v-card-subtitle>

            <v-card-actions>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                      density="comfortable"
                      rounded="lg"
                      icon="mdi-list-status"
                      color="teal"
                      v-bind="props"
                  />
                </template>
                <v-list>
                  <v-list-item
                      v-for="item in statuses"
                      :key="item.value"
                      :value="item.value"
                      @click="updateStatus(block.assignmentBlock._id, item.value)"
                  >
                    <v-list-item-title>{{ item.value }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script>
import testDataAssignmentBlocks from "@/configs/data-test/data-test-assignment-blocks";
import {fetchAssignmentBlocksAll} from "@/utils/methods/assignment-block-requests";
import getDateTime from "@/utils/methods/getTime";

export default {
  name: "assignment-blocks-page",

  data: () => ({

    blocksData: [],

    statusMap: {
      ['Выполнено']: 'В ожидании',
      ['В ожидании']: 'В работе',
      ['В работе']: 'Выполнено',
    },

    statuses: [
      {
        color: 'blue-grey-lighten-4',
        value: 'В ожидании',
      },
      {
        color: 'orange-lighten-2',
        value: 'В работе',
      },
      {
        color: 'teal-lighten-1',
        value: 'Выполнено',
      },
    ]
  }),

  mounted() {
    this.fetchAssignmentBlocks();
  },

  methods: {

    getDateTime: getDateTime,

    getBlocksByStatus(status) {
      return this.blocksData.filter(e => e.assignmentBlock.status === status);
    },

    blocksCount(status) {
      return this.blocksData.filter(e => e.assignmentBlock.status === status)?.length;
    },

    updateStatus(id, status) {
      this.blocksData = this.blocksData.map(e => {
        if (e._id === id) {
          return {...e, status: status}
        } else {
          return e;
        }
      })
      console.log('Статус обновлен')
    },

    fetchAssignmentBlocks() {
      fetchAssignmentBlocksAll()
          .then(response => {
            console.log('Блоки успешно получены');
            return response?.data;
          })
          .catch(err => {
            console.log('Ошибка получения блоков', err);
            return testDataAssignmentBlocks;
          })
          .then(data => {
            this.blocksData = data;
          })
    },

  },


}
</script>