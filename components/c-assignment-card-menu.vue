<template>
  <v-sheet
      rounded="lg"
      height="700px"
      width="1024px"
      elevation="24"
  >
    <v-card rounded="lg">
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
              assignment?.contract?.customer?.shortName && assignment?.contract?.customer?.inn ?
                  `Заказчик: ${assignment?.contract?.customer?.shortName} / ${assignment?.contract?.customer?.inn}` :
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
                v-for="item in blocksMap()"
                :key="item._id"
                @click="blockSelect(item._id)"
            >
              <td v-for="v of item.values">{{v}}</td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
        </v-sheet>
        <v-card variant="text">
          <v-card-item>
            <div class="d-flex align-center mt-2">
              <v-text-field
                  v-model="currentPage"
                  color="blue-grey-darken-3"
                  variant="outlined"
                  density="compact"
                  type="number"
                  rounded="lg"
                  hide-details
                  style="width: 80px; max-width: 80px"
                  @update:modelValue="fetchAssignmentBlocksDebounce"
              />
              <v-pagination
                  v-model="currentPage"
                  density="comfortable"
                  color="blue-grey-darken-2"
                  show-first-last-page
                  :length="totalPages"
                  :total-visible="8"
                  @update:modelValue="fetchAssignmentBlocks"
              />
            </div>
          </v-card-item>
        </v-card>
      </v-card-text>
    </v-card>

    <my-overlay v-model="cardChangeMenu">
      <c-assignment-card-change-menu :_assignment="assignment" @update:success="$emit('update:success')"/>
    </my-overlay>

    <my-overlay v-model="inspectionObjectsMenuIsShow">
      <c-inspection-objects-menu :_assignmentBlock="selectedBlock"/>
    </my-overlay>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import dataAssignmentBlocks from "../configs/data-test/data-test-assignment-blocks";
import {fetchAssignmentBlocks} from "../utils/methods/assignment-block-requests";
import {showAlert, timeStringToDate} from "../utils/service/serverAPI";

export default {
  name: "c-assignment-card-menu",

  props: {
    _assignment: Object,
  },

  data: () => ({
    searchText: null,

    assignmentBlocks: [],
    currentPage: 1,
    limitItems: 3,
    totalItems: 0,
    totalPages: 1,

    cardChangeMenu: false,
    snackBar: {},
    selectedBlock: null,
    inspectionObjectsMenuIsShow: false,
    fetchBlocksLoading: true,

    assignment: {
      _id: '',
      title: '',
      description: '',
      contract: null,
    },


  }),

  mounted() {
    this.propsClone();
    this.fetchAssignmentBlocks();
  },

  watch: {
    _assignment() {
      this.propsClone();
    },
    assignmentBlocks() {
      if (this.selectedBlock?._id) {
        this.selectedBlock = this.assignmentBlocks.find(e => e._id === this.selectedBlock?._id);
      }
    }
  },

  methods: {

    propsClone() {
      this.assignment = _.cloneDeep(this._assignment);
    },

    blockSelect(_id) {
      this.selectedBlock = this.assignmentBlocks.find(e => e._id === _id);
      this.inspectionObjectsMenuIsShow = true;
    },

    blocksMap() {
      return this.assignmentBlocks.map(item => ({
        _id: item._id,
        values: [
          item.loanAgreement,
          timeStringToDate(item.loanAgreementDate, 20).toLocaleDateString(),
          item.pledgeAgreement,
          timeStringToDate(item.plegeAgreementDate, 20).toLocaleDateString(),
          timeStringToDate(item.startDate, 20).toLocaleDateString(),
          timeStringToDate(item.endDate, 20).toLocaleDateString(),
          item.status
        ]
      }))
    },

    fetchAssignmentBlocksDebounce: _.debounce(function () {
      this.fetchAssignmentBlocks();
    }, 1000),

    createQueryParams() {

      let queryParams = [
        this.currentPage && this.currentPage > 0 ? `page=${this.currentPage}` : null,
        this.limitItems && this.limitItems > 0 ? `limit=${this.limitItems}` : null,
        this.searchText && this.searchText.length > 0 ? `searchText=${this.searchText}` : null,
        this.assignment?._id ? `assignmentId=${this.assignment?._id}` : null,
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