<template>
  <v-sheet>
    <v-card class="mx-auto" variant="text">

      <v-card-title>Блоки задач</v-card-title>

      <v-card-item>
        <div class="d-flex ga-4 align-center">
          <my-search-bar
              v-model="searchText"
              :hint="`Найдено: ${0}`"
              @update:modelValue="fetchAssignmentBlocks"
              style="min-width: 500px"
              hideButton
          />
        </div>
      </v-card-item>
    </v-card>

    <v-container fluid>

      <v-row dense>
        <v-col v-for="status of statuses" class="d-flex flex-column ga-2">

          <v-sheet
              :color="status.color"
              variant="outlined"
              elevation="4"
              class="d-flex justify-space-between px-3 rounded"
          >
            <div>{{ status.value }}</div>
            <div>{{ blocksCount(status.value) }}</div>
          </v-sheet>

          <v-card
              v-for="block of blocksByStatus(status.value)"
              :key="block._id"
              variant="tonal"
              color="blue-grey-darken-2"
              :color="Date.now() > block.endDate ? 'red-lighten-4' : ''"
          >
            <v-card-item>
              {{ block.title }}
            </v-card-item>

            <v-card-subtitle>
              <div><b>Дедлайн:</b> {{ timeStringToDate(block?.endDate).toLocaleDateString() }}</div>
              <div><b>Номер договора:</b> {{ block?.contract?.contractNumber }}</div>
              <div><b>Исполнитель:</b> {{ block?.inspector?.fullName }}</div>
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
import testDataAssignmentBlocks from "../../configs/data-test/data-test-assignment-blocks.ts";
import {fetchAssignmentBlocksKanban} from "../../utils/service/server.ts";
import {timeStringToDate} from "../../utils/service/serverAPI";

export default {
  name: "assignment-blocks-page",

  data: () => ({

    data: [],

    searchText: '',
    currentPage: 1,
    limitItems: 20,

    statusesInspector: [
      {
        color: 'yellow-darken-2',
        value: 'В ожидании',
      },
      {
        color: 'blue-darken-2',
        value: 'В работе',
      },
      {
        color: 'teal-lighten-1',
        value: 'Согласование',
      },
      {
        color: 'teal-darken-3',
        value: 'Завершено',
      },
    ],

    statuses: [
      {
        color: 'blue-grey-darken-2',
        value: 'КП',
      },
      {
        color: 'yellow-darken-2',
        value: 'В ожидании',
      },
      {
        color: 'blue-darken-2',
        value: 'В работе',
      },
      {
        color: 'teal-lighten-1',
        value: 'Согласование',
      },
      {
        color: 'teal-darken-1',
        value: 'Закрытие',
      },
      {
        color: 'teal-darken-3',
        value: 'Завершено',
      },
    ]
  }),

  mounted() {
    this.fetchAssignmentBlocks();
  },

  methods: {

    timeStringToDate,

    createQueryParams() {

      let queryParams = [
        this.currentPage && this.currentPage > 0 ? `page=${this.currentPage}` : null,
        this.limitItems && this.limitItems > 0 ? `limit=${this.limitItems}` : null,
        this.searchText && this.searchText.length > 0 ? `searchText=${this.searchText}` : null,
      ].filter(e => !!e).join('&');

      return queryParams && queryParams?.length > 0 ? `?${queryParams}` : '';
    },

    blocksByStatus(status) {
      return this.data?.filter(item => item.status === status);
    },

    blocksCount(status) {
      return this.data?.filter(item => item?.status === status)?.length;
    },

    updateStatus(id, status) {
      this.data = this.data?.map(e => {
        if (e._id === id) {
          return {...e, status: status}
        } else {
          return e;
        }
      })
      console.log('Статус обновлен')
    },

    fetchAssignmentBlocks() {
      fetchAssignmentBlocksKanban(this.createQueryParams())
          .then(response => {
            this.data = response.data?.data;
          })
          .catch(err => {
            this.data = testDataAssignmentBlocks;
            console.log('Ошибка получения блоков', err);
          })
    },

  },


}
</script>