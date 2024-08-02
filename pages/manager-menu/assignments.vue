<template>
  <v-container fluid>
    <v-sheet>
      <v-card
          class="mx-auto"
          variant="text"
          :loading="fetchingData"
      >

        <v-card-title>
          Список заданий
        </v-card-title>

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

      <div style="min-height: 800px" class="mt-4">
        <v-divider/>
        <v-table
            style="height: 800px"
            density="comfortable"
            fixed-header
        >
          <thead v-if="!fetchingData">
          <tr>
            <th class="text-left">№</th>
            <th class="text-left">Заголовок</th>
            <th class="text-left">Описание</th>
            <th class="text-left">Номер договора</th>
            <th class="text-left">Дата договора</th>
            <th class="text-left">Заказчик</th>
            <th class="text-left">Тел.</th>
            <th class="text-left">Email</th>
            <th class="text-left"></th>
          </tr>
          </thead>
          <tbody v-if="!fetchingData">
          <tr
              v-for="(item, itemI) of mapData()" :key="item._id"
              @click="cardMenuShow(item)"
          >
            <td v-for="value of item.values">{{ value }}</td>
            <td>
              <v-btn
                  @click.stop="removeDataItem(item._id)"
                  density="compact"
                  variant="text"
                  color="red-darken-4"
                  icon="mdi-progress-close"
              />
            </td>
          </tr>
          </tbody>
        </v-table>

        <v-divider/>
      </div>

      <div class="d-flex align-center mt-4">
        <v-text-field
            v-model="currentPage"
            variant="outlined"
            density="compact"
            color="blue-grey-darken-3"
            type="number"
            hide-details
            style="width: 80px; max-width: 80px"
            @update:modelValue="fetchData"
        />
        <v-pagination
            v-model="currentPage"
            density="default"
            show-first-last-page
            :length="totalPages"
            :total-visible="8"
            @update:modelValue="fetchData"
        />
      </div>

    </v-sheet>

    <my-overlay v-model="addMenuVisible">
      <c-assignment-card-add-menu @add:success="fetchData"/>
    </my-overlay>

    <my-overlay v-model="cardMenuIsVisible">
      <c-assignment-card-menu :_assignment="selectedItem"/>
    </my-overlay>
  </v-container>
</template>

<script>
import _ from "lodash";
import dataAssignments from "../../configs/data-test/data-test-assignments";
import {timeStringToDate} from "../../utils/service/serverAPI.js";
import {fetchAssignments, removeAssignment} from "../../utils/methods/assignment-requests.ts";

export default {
  name: "assignments-page",

  data: () => ({

    data: [],
    fetchingData: false,
    currentPage: 1,
    itemsLimit: 50,
    totalItems: 1,
    totalPages: 1,
    searchText: '',
    selectedItem: {},
    cardMenuIsVisible: false,
    addMenuVisible: false,

  }),

  mounted() {
    this.fetchData();
  },

  methods: {

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
            console.log('Элемент успешно удален');
            this.fetchData();
          })
          .catch(err => {
            console.log('Ошибка удаления элемента', err);
          })
    },

    cardMenuShow(_item) {
      this.selectedItem = {..._item};
      this.cardMenuIsVisible = true;
    },

    mapData() {
      let result = this.data.map((item, itemI) => ({
        _id: item._id,
        values: [
          itemI + 1,
          item?.title || '-',
          item?.description?.slice(0, 50) || '-',
          item?.contract?.contractNumber || '-',
          timeStringToDate(item?.contract?.contractDate)?.toLocaleDateString() || '',
          item?.customer?.fullName || '-',
          item?.customer?.phoneNumber || '-',
          item?.customer?.email || '-'
        ]
      }))

      // console.log('result', result);
      return result;
    }
  }
}
</script>