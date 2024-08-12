<template>
  <v-container fluid>
    <v-sheet>
      <v-card
          class="mx-auto"
          variant="text"
          :loading="fetchingData"
      >

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <my-search-bar
                v-model="searchText"
                :hint="`Найдено: ${totalItems}`"
                style="min-width: 500px"
                @btn:click="addMenuVisible = true"
                @update:modelValue="fetchDataDebounce900"
            />
          </div>
        </v-card-item>
      </v-card>

      <div style="min-height: 700px" class="mt-4">
        <v-divider/>
        <v-table
            style="height: 700px"
            density="comfortable"
            class="text-caption"
            fixed-header
        >
          <thead v-if="!fetchingData">
          <tr>
            <th>№</th>
            <th>Заголовок</th>
            <th>Описание</th>
            <th>Договор</th>
            <th>Заказчик</th>
            <th></th>
          </tr>
          </thead>
          <tbody v-if="!fetchingData">
          <tr
              v-for="(assignment, i) of data"
              :key="assignment._id"
              @click="cardMenuShow(assignment._id)"
          >
            <td>{{i}}</td>
            <td>
              <div>{{assignment.title}}</div>
              <div><b>Создан: </b>{{assignment.createdAt}}</div>
            </td>
            <td>
              {{assignment.description}}
            </td>
            <td>
              <div><b>Номер: </b>{{assignment.contract.contractNumber}}</div>
              <div><b>Заключен: </b>{{timeStringToDate(assignment.contract.contractDate).toLocaleDateString()}}</div>
            </td>
            <td>
              <div><b></b>{{assignment.contract.customer.shortName}}</div>
              <div><b>email: </b>{{assignment.contract.customer.email}}</div>
            </td>
            <td>
              <c-remove-btn :prompt="'Удалить'" @click:yes="removeDataItem(assignment._id)"/>
            </td>
          </tr>
          </tbody>
        </v-table>

        <v-divider/>
      </div>

      <div class="d-flex align-center mt-4">
        <v-text-field
            v-model="currentPage"
            color="blue-grey-darken-3"
            variant="outlined"
            density="compact"
            type="number"
            rounded="lg"
            hide-details
            style="width: 80px; max-width: 80px"
            @update:modelValue="fetchData"
        />
        <v-pagination
            v-model="currentPage"
            density="comfortable"
            color="blue-grey-darken-2"
            show-first-last-page
            :length="totalPages"
            :total-visible="8"
            @update:modelValue="fetchData"
        />
      </div>

    </v-sheet>

    <my-overlay v-model="addMenuVisible">
      <c-assignment-card-menu-add @add:success="fetchData"/>
    </my-overlay>

    <my-overlay v-model="cardMenuIsVisible">
      <c-assignment-card-menu :_assignment="selectedAssignment" @update:success="fetchData"/>
    </my-overlay>

  </v-container>
</template>

<script>
import _ from "lodash";
import dataAssignments from "../../configs/data-test/data-test-assignments";
import {timeStringToDate} from "../../utils/service/serverAPI";
import {fetchAssignments, removeAssignment} from "../../utils/service/server.ts";

export default {
  name: "assignments-page",
  components: {},


  data: () => ({

    data: [],
    fetchingData: false,
    currentPage: 1,
    itemsLimit: 50,
    totalItems: 1,
    totalPages: 1,
    searchText: '',
    selectedAssignment: {},
    cardMenuIsVisible: false,
    addMenuVisible: false,

  }),

  watch: {
    data() {
      if (this.selectedAssignment?._id) {
        this.selectedAssignment = this.data.find(e => e._id === this.selectedAssignment._id);
      }
    },
  },

  mounted() {
    this.fetchData();
  },

  methods: {

    timeStringToDate,

    getQuery() {
      let params = [
        this.currentPage ? `page=${this.currentPage}` : null,
        this.itemsLimit ? `limit=${this.itemsLimit}` : null,
        this.searchText ? `searchText=${this.searchText}` : null,
      ].filter(e => !!e).join('&')

      return params ? `?${params}` : '';
    },

    fetchDataDebounce900: _.debounce(function () {
      this.fetchData();
    }, 900),

    fetchData() {
      this.fetchingData = true;
      fetchAssignments(this.getQuery())
          .then(response => {
            this.currentPage = response.data.currentPage;
            this.totalItems = response.data.totalItems;
            this.totalPages = response.data.totalPages;
            this.pageSize = response.data.pageSize;
            this.data = response.data.data;
          })
          .catch(err => {
            console.log('Ошибка получения данных с сервера', err);
            this.data = dataAssignments;
          })
          .finally(() => {
            this.fetchingData = false;
          })
    },

    removeDataItem(_id) {
      removeAssignment(_id)
          .then(() => {
            this.fetchData();
          })
          .catch(err => {
            console.log('Ошибка удаления элемента', err);
          })
    },

    cardMenuShow(_itemId) {
      this.selectedAssignment = this.data.find(e => e._id === _itemId);
      this.cardMenuIsVisible = true;
    },
  }
}
</script>