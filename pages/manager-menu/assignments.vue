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
                @btn:click="navigateTo('/manager-menu/assignments/assignment-card-add')"
                @update:modelValue="fetchData"
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
            <th>Договор</th>
            <th>Заказчик</th>
            <th>Описание</th>
            <th></th>
          </tr>
          </thead>
          <tbody v-if="!fetchingData">
          <tr
              v-for="(assignment, i) of data"
              :key="assignment._id"
              @click="cardMenuShow(assignment)"
          >
            <!--            @click="cardMenuShow(assignment._id)"-->
            <td style="min-width: 30px; width: 30px; max-width: 30px">{{ i }}</td>
            <td style="min-width: 280px; width: 280px; max-width: 280px">
              <div>{{ assignment.title }}</div>
              <div><b>Создан: </b>{{ assignment.createdAt }}</div>
            </td>

            <td style="min-width: 240px; width: 240px; max-width: 240px">
              <div><b>Номер: </b>{{ assignment.contract.contractNumber }}</div>
              <div><b>Заключен: </b>{{ timeStringToDate(assignment.contract.contractDate).toLocaleDateString() }}</div>
            </td>
            <td style="min-width: 240px; width: 240px;max-width: 240px">
              <div><b></b>{{ assignment.contract.customer.shortName }}</div>
              <div><b>email: </b>{{ assignment.contract.customer.email }}</div>
            </td>
            <td style="min-width: 600px; width: 600px; max-width: 600px">
              {{ slicer(assignment.description, 260) }}
            </td>
            <td style="min-width: 65px; width: 65px; max-width: 65px">
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

    <nuxt-page
        :_assignment="selectedAssignment"
        @add:success="fetchData"
        @update:success="fetchData"
    />
  </v-container>
</template>

<script>
import _ from "lodash";
import dataAssignments from "../../configs/data-test/data-test-assignments";
import {slicer, timeStringToDate} from "../../utils/service/serverAPI";
import {fetchAssignments, removeAssignment} from "../../utils/service/server";

export default {
  name: "assignments-page",

  data() {
    return {
      data: [],
      fetchingData: false,
      currentPage: 1,
      itemsLimit: 50,
      totalItems: 1,
      totalPages: 1,
      searchText: '',
      selectedAssignment: {},
    }
  },

  watch: {
    data() {
      if (this.selectedAssignment?._id) {

        this.selectedAssignment = this.data.find(e => e._id === this.selectedAssignment._id);

        if (this.selectedAssignment) {
          sessionStorage.setItem('selectedAssignment', JSON.stringify(this.selectedAssignment));
        }
      }
    },
  },

  mounted() {
    this.fetchData();
    this.sessionLoad();
  },

  methods: {

    timeStringToDate,
    slicer,

    sessionLoad() {
      // Берем последний выбранный элемент assignment из session storage
      let selectedAssignment = sessionStorage.getItem('selectedAssignment');

      if (selectedAssignment) {

        let _selectedAssignment = JSON.parse(selectedAssignment);

        // console.log('this.data', this.data)

        // if (this.data.find(e => e._id === _selectedAssignment._id)) {
        this.selectedAssignment = _selectedAssignment;
        // }
      }
    },

    cardMenuShow(_assignment) {
      this.selectedAssignment = _assignment;
      sessionStorage.setItem('selectedAssignment', JSON.stringify(_assignment));
      navigateTo('/manager-menu/assignments/assignment-card');
    },

    fetchDataDebounce900: _.debounce(function () {
      this.fetchData();
    }, 900),

    async fetchData() {

      this.fetchingData = true;

      let params = [
        this.currentPage ? `page=${this.currentPage}` : null,
        this.itemsLimit ? `limit=${this.itemsLimit}` : null,
        this.searchText ? `searchText=${this.searchText}` : null,
      ].filter(e => !!e).join('&');

      fetchAssignments(params ? `?${params}` : '')
          .then(response => {
            let {currentPage, totalItems, totalPages, pageSize, data} = response.data;
            this.currentPage = currentPage;
            this.totalItems = totalItems;
            this.totalPages = totalPages;
            this.pageSize = pageSize;
            this.data = data;
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
          .then(() => this.fetchData())
          .catch(err => console.log('Ошибка удаления элемента', err))
    },
  }
}
</script>