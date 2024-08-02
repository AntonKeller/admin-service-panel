<template>
  <v-sheet
      rounded="lg"
      height="700px"
      width="1024px"
      elevation="24"
      color="white"
  >
    <v-card
        height="100%"
        rounded="lg"
        elevation="0"
    >
      <v-card-title>
        <v-sheet class="d-flex ga-2">
          <v-btn
              variant="tonal"
              icon="mdi-pencil-outline"
              density="comfortable"
              color="blue-grey-darken-3"
              rounded="lg"
              @click="cardChangeMenu = true"
          />
          {{ assignment?.title }}
        </v-sheet>
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-2">
        <div class="d-flex ga-2">
          <v-chip
              density="comfortable"
              color="blue-grey-darken-3"
              rounded="lg"
              prepend-icon="mdi-file-sign"
          >
            {{
              assignment?.contract?.contractNumber && assignment?.contract?.contractDate ?
                  `Договор: ${assignment?.contract?.contractNumber} / ${assignment?.contract?.contractDate}` :
                  'Отсутствует договор'
            }}
          </v-chip>


          <v-chip
              density="comfortable"
              color="blue-grey-darken-3"
              rounded="lg"
              prepend-icon="mdi-account-tie"
          >
            {{
              assignment?.customer?.shortName && assignment?.customer?.inn ?
                  `Заказчик: ${assignment?.customer?.shortName} / ${assignment?.customer?.inn}` :
                  'Отсутствует заказчик'
            }}
          </v-chip>

        </div>
        <div style="height: 140px; overflow-y: scroll">
          {{ assignment?.description }}
        </div>
        <v-divider class="my-1" color="teal-darken-4"/>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              style="min-width: 300px"
              label="Поиск"
              persistent-hint
              :hint="`Найдено: ${totalItems}`"
              v-model="searchText"
              @update:modelValue="fetchAssignmentBlocksDebounce"
          />
          <v-autocomplete
              v-model="activeStatus"
              :items="statuses"
              density="compact"
              variant="outlined"
              color="blue-grey-lighten-2"
              item-title="name"
              item-value="name"
              placeholder="Статус по умолчанию"
              rounded="lg"
              style="min-width: 270px; max-width: 270px"
              prepend-inner-icon="mdi-filter-cog-outline"
              @update:modelValue="fetchAssignmentBlocksDebounce"
          >
            <template v-slot:chip="{ props, item }">
              {{ item.raw.title }}
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item rounded="lg" v-bind="props" :title="item.raw.title"/>
            </template>
          </v-autocomplete>
        </div>
        <v-sheet height="290px">
          <v-divider/>
          <div v-if="fetchBlocksLoading" class="d-flex align-center justify-center h-100">
            <v-progress-circular
                :size="140"
                :width="3"
                color="teal"
                indeterminate
            >загрузка...
            </v-progress-circular>
          </div>
          <v-table v-if="!fetchBlocksLoading" height="290px" fixed-header density="comfortable">
            <col style="min-width: 181px">
            <col style="min-width: 121px">
            <col style="min-width: 141px">
            <col style="min-width: 121px">
            <col style="min-width: 141px">
            <col style="min-width: 141px">
            <col style="min-width: 141px">
            <thead>
            <tr>
              <th>Кредитный договор</th>
              <th>Дата кд</th>
              <th>Договор залога</th>
              <th>Дата дз</th>
              <th>Начало</th>
              <th>Окончание</th>
              <th>Статус</th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="item in assignmentBlocks"
                :key="item._id"
                @click="aBlockClick(item)"
            >
              <td>{{ item.loanAgreement }}</td>
              <td>{{ timeStringToDate(item.loanAgreementDate, 20).toLocaleDateString() }}</td>
              <td>{{ item.plegeAgreement }}</td>
              <td>{{ timeStringToDate(item.plegeAgreementDate, 20).toLocaleDateString() }}</td>
              <td>{{ timeStringToDate(item.startDate, 20).toLocaleDateString() }}</td>
              <td>{{ timeStringToDate(item.endDate, 20).toLocaleDateString() }}</td>
              <td>{{ item.status }}</td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
        </v-sheet>
        <v-card variant="text">
          <v-card-item>
            <div class="d-flex align-center">
              <v-text-field
                  v-model="currentPage"
                  variant="outlined"
                  density="compact"
                  rounded="lg"
                  hide-details
                  label="Страница"
                  type="number"
                  style="min-width: 80px; width: 80px; max-width: 80px"
                  :clearable="false"
                  @update:modelValue="fetchAssignmentBlocksDebounce"
              />
              <v-pagination
                  style="max-width: 800px"
                  show-first-last-page
                  density="default"
                  total-visible="5"
                  v-model="currentPage"
                  :length="totalPages"
                  rounded="circle"
                  @update:modelValue="fetchAssignmentBlocks"
              />
            </div>
          </v-card-item>
        </v-card>
      </v-card-text>
    </v-card>

    <my-overlay v-model="cardChangeMenu">
      <c-assignment-card-change-menu :_assignment="assignment"/>
    </my-overlay>

    <my-overlay v-model="selectedBlock">
      <c-inspection-objects-menu/>
    </my-overlay>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import statuses from "../configs/assignment-statuses";
import dataAssignmentBlocks from "../configs/data-test/data-test-assignment-blocks";
import {fetchAssignmentBlocks} from "../utils/methods/assignment-block-requests";
import {showAlert, timeStringToDate} from "../utils/service/serverAPI";

export default {
  name: "c-assignment-card-menu",

  props: {
    _assignment: Object,
  },

  data: () => ({

    statuses,
    activeStatus: null,
    searchText: null,

    assignmentBlocks: [],
    currentPage: 1,
    limitItems: 3,
    totalItems: 0,
    totalPages: 1,

    cardChangeMenu: false,
    snackBar: {},
    contracts: [],
    customers: [],
    selectedBlock: null,
    fetchBlocksLoading: true,

    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: null,
      customer: null
    },
  }),

  mounted() {
    this.assignment = _.cloneDeep(this._assignment);
    this.fetchAssignmentBlocks();
  },

  methods: {

    timeStringToDate,

    aBlockClick(_block) {
      this.selectedBlock = ({..._block});
      console.log('this.selectedBlock', this.selectedBlock);
    },

    fetchAssignmentBlocksDebounce: _.debounce(function () {
      this.fetchAssignmentBlocks();
    }, 1000),

    createQueryParams() {

      let queryParams = [
        this.currentPage && this.currentPage > 0 ? `page=${this.currentPage}` : null,
        this.limitItems && this.limitItems > 0 ? `limit=${this.limitItems}` : null,
        this.searchText && this.searchText.length > 0 ? `searchText=${this.searchText}` : null,
        this.activeStatus?.title && this.activeStatus?.title.length > 0 ? `status=${this.activeStatus?.title}` : null,
        this.assignment?._id ? `assignmentID=${this.assignment?._id}` : null,
      ].filter(e => !!e).join('&');

      return queryParams && queryParams?.length > 0 ? `?${queryParams}` : '';
    },

    fetchAssignmentBlocks() {

      this.fetchBlocksLoading = true;

      fetchAssignmentBlocks(this.createQueryParams())
          .then(resp => {
            this.assignmentBlocks = resp?.data?.data
            this.currentPage = resp?.data?.currentPage;
            this.limitItems = resp?.data?.pageSize;
            this.totalItems = resp?.data?.totalItems;
            this.totalPages = resp?.data?.totalPages;
            console.log('this.assignmentBlocks', this.assignmentBlocks)
          })
          .catch(err => {
            console.log('Ошибка получения блоков ТЗ', err);
            this.snackBar = showAlert('Используются тестовые данные!').error();
            this.assignmentBlocks = dataAssignmentBlocks;
          })
          .finally(() => {
            this.fetchBlocksLoading = false;
          })
    }

  }
}
</script>

<style>

tr:hover > td {
  text-decoration: underline;
  cursor: pointer;
}

</style>