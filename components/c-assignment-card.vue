<template>
  <v-sheet
      rounded="lg"
      height="700px"
      width="1024px"
      elevation="6"
      color="white"
  >
    <v-card rounded="lg">
      <v-card-title>
        <v-sheet class="d-flex ga-2">
          <c-btn-change prompt="Редактировать ТЗ" @click="cardChangeMenu = true"/>
          {{ assignment?.title }}
        </v-sheet>
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-2">
        <div class="d-flex ga-2">
          <v-chip
              border="sm"
              density="comfortable"
              color="blue-grey-darken-2"
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
              border="sm"
              density="comfortable"
              color="blue-grey-darken-2"
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
        <v-sheet class="rounded-lg  px-2 py-2" style="height: 140px; overflow-y: scroll">
          {{ assignment?.description }}
        </v-sheet>
        <v-divider class="my-1"/>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              style="min-width: 360px"
              label="Поиск"
              persistent-hint
              :hint="`Найдено: ${totalItems}`"
              v-model="searchText"
              @update:modelValue="fetchAssignmentBlocksDebounce"
              @btn:click="blockMenuAddIsShow = true"
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
          <v-table v-if="!fetchBlocksLoading" height="290px" fixed-header density="default" class="text-caption">
            <thead>
            <tr>
              <th>Кредитный договор</th>
              <th>Договор залога</th>
              <th>Сроки</th>
              <th>Статус</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="block of assignmentBlocks"
                :key="block._id"
                @click="blockSelect(block)"
            >
              <td style="min-width: 280px; max-width: 280px">
                <div><b>Номер: </b>{{ block.loanAgreement }}</div>
                <div><b>Дата: </b>{{ timeStringToDate(block.loanAgreementDate, 20).toLocaleDateString() }}</div>
              </td>
              <td style="min-width: 280px; max-width: 280px">
                <div><b>Номер: </b>{{ block.pledgeAgreement }}</div>
                <div><b>Дата: </b>{{ timeStringToDate(block.pledgeAgreementDate, 20).toLocaleDateString() }}</div>
              </td>
              <td style="min-width: 180px; max-width: 180px">
                <div><b>Начало:</b> {{ timeStringToDate(block.startDate, 20).toLocaleDateString() }}</div>
                <div><b>Окончание:</b> {{ timeStringToDate(block.endDate, 20).toLocaleDateString() }}</div>
              </td>
              <td style="min-width: 147px; max-width: 147px">
                {{ block.status }}
              </td>
              <td style="min-width: 30px; max-width: 30px">
                <c-remove-btn :prompt="'Удалить'" @click:yes="removeBlockItem(block._id)"/>
              </td>
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
      <c-assignment-card-change :_assignment="assignment" @update:success="$emit('update:success')"/>
    </my-overlay>

    <my-overlay v-model="aBlockCardMenuIsShow">
      <c-a-block-card
          :_assignmentId="_assignment._id"
          :_assignmentBlock="selectedBlock"
          @update:success="fetchAssignmentBlocks"
      />
    </my-overlay>

    <my-overlay v-model="blockMenuAddIsShow">
      <c-a-block-card-add
          :_assignmentId="_assignment._id"
          @add:success="fetchAssignmentBlocks"
      />
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
import {fetchAssignmentBlocks, removeAssignmentBlock} from "../utils/service/server.ts";
import {showAlert, timeStringToDate} from "../utils/service/serverAPI";

export default {
  name: "c-assignment-card",

  props: {
    _assignment: Object,
  },

  data: () => ({
    searchText: null,

    assignmentBlocks: [],
    currentPage: 1,
    limitItems: 20,
    totalItems: 0,
    totalPages: 1,

    cardChangeMenu: false,
    snackBar: {},
    selectedBlock: null,
    blockMenuAddIsShow: false,
    aBlockCardMenuIsShow: false,
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
      this.fetchAssignmentBlocks();
    },
    assignmentBlocks() {
      if (this.selectedBlock?._id) {
        this.selectedBlock = this.assignmentBlocks.find(e => e._id === this.selectedBlock?._id);
      }
    }
  },

  methods: {

    timeStringToDate,

    removeBlockItem(_id) {
      removeAssignmentBlock(_id)
          .then(() => {
            this.fetchAssignmentBlocks();
          })
          .catch(err => {
            console.log('Ошибка удаления элемента', err);
          })
    },

    propsClone() {
      this.assignment = _.cloneDeep(this._assignment);
    },

    blockSelect(_block) {
      this.selectedBlock = _block;
      this.aBlockCardMenuIsShow = true;
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