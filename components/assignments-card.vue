<template>
  <v-sheet
      height="700px"
      width="1024px"
      elevation="6"
      rounded="sm"
  >
    <v-card rounded="sm" variant="text">
      <v-card-title>
        <div class="d-flex justify-space-between">
          <div>{{ getSelectedAssignment?.title }}</div>
          <div>
            <v-btn
                density="comfortable"
                color="blue-darken-1"
                rounded
                icon="mdi-pencil"
                @click="navigateTo('/manager-menu/assignments/assignment-change')"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Редактировать ТЗ
              </v-tooltip>
            </v-btn>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-2">
        <div class="d-flex ga-2">
          <v-chip
              prepend-icon="mdi-file-sign"
              color="blue-grey-darken-2"
              density="comfortable"
              rounded="sm"
              border="sm"
              :text="assignmentContract"
          />
          <v-chip
              prepend-icon="mdi-account-tie"
              color="blue-grey-darken-2"
              density="comfortable"
              rounded="sm"
              border="sm"
              :text="assignmentCustomer"
          />
        </div>
        <v-sheet class="rounded-lg px-2 py-2" style="height: 140px; overflow-y: scroll">
          {{ getSelectedAssignment?.description }}
        </v-sheet>
        <v-divider class="my-1"/>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              v-model="searchText"
              style="min-width: 360px"
              persistent-hint
              label="Поиск"
              :hint="`Найдено: ${blocksSearchCount}`"
              @btn:click="navigateTo('/manager-menu/assignments/assignment/block-add')"
          />
        </div>
        <v-sheet>
          <v-divider/>
          <div v-if="fetching" class="d-flex align-center justify-center h-100">
            <v-progress-circular
                :size="140"
                :width="3"
                color="teal"
                indeterminate
            >загрузка...
            </v-progress-circular>
          </div>
          <v-table v-if="!fetching" height="290px" fixed-header density="default" class="text-caption">
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
                v-for="block of blocksSLice"
                :key="block._id"
                @click="selectBlock(block)"
            >
              <td style="min-width: 260px; max-width: 260px">
                <div><b>Номер: </b>{{ block.loanAgreement }}</div>
                <div><b>Дата: </b>{{ timestampToDateString(block.loanAgreementDate) }}</div>
              </td>
              <td style="min-width: 260px; max-width: 260px">
                <div><b>Номер: </b>{{ block.pledgeAgreement }}</div>
                <div><b>Дата: </b>{{ timestampToDateString(block.pledgeAgreementDate) }}</div>
              </td>
              <td style="min-width: 180px; max-width: 180px">
                <div><b>Начало:</b> {{ timestampToDateString(block.startDate) }}</div>
                <div><b>Окончание:</b> {{ timestampToDateString(block.endDate) }}</div>
              </td>
              <td style="min-width: 120px; max-width: 120px">
                {{ block.status }}
              </td>
              <td style="min-width: 50px; max-width: 50px">
                <c-remove-btn class="" prompt="Удалить" @click:yes="removeBlockById(block._id)"/>
              </td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
          <div class="d-flex align-center mt-4">
            <v-pagination
                v-model="currentPage"
                color="blue-grey-darken-2"
                density="comfortable"
                show-first-last-page
                :length="totalPages"
                :total-visible="8"
            />
          </div>
        </v-sheet>
      </v-card-text>
    </v-card>

    <nuxt-page/>

    <!--      TODO: Сделать nuxt-page -->
    <!--      <my-overlay v-model="aBlockCardMenuIsShow">-->
    <!--        <c-a-block-assignment :_assignmentId="getSelectedAssignment._id" :_assignmentBlock="selectedBlock"/>-->
    <!--      </my-overlay>-->

    <!--      <my-overlay v-model="blockMenuAddIsShow">-->
    <!--        <c-block-add :_assignmentId="getSelectedAssignment._id"/>-->
    <!--      </my-overlay>-->

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-sheet>
</template>

<script>
import {timestampToDateString} from "../utils/functions.js";

export default {
  name: "assignments-card",

  data: () => ({
    searchText: '',
    currentPage: 1,
    itemsPerPage: 2,
    visibility: false,
    snackBar: {},
  }),

  watch: {
    getSelectedAssignment() {
      let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']._id;
      if (assignmentId) {
        this.$store.dispatch('assignmentBlocks/UPDATE_ITEMS', assignmentId);
      }
    },
  },

  beforeMount() {
    try {
      // Считываем выбранный Блок ТЗ из session storage
      if (sessionStorage?.selectedAssignmentBlock) {
        let assignmentBlock = JSON.parse(sessionStorage?.selectedAssignmentBlock);
        this.$store.commit('assignmentBlocks/SELECT_ITEM', assignmentBlock);
      }
    } catch (err) {
      console.log('Неудалось прочитать выбранный Блок ТЗ из session storage');
    }
  },

  mounted() {

    // Обновляем список блоков по ID ТЗ...............................................
    let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']._id;

    if (assignmentId) {
      this.$store.dispatch('assignmentBlocks/UPDATE_ITEMS', assignmentId);
    } else {
      navigateTo('/manager-menu/assignments')
      // TODO: Если ТЗ не выбрано - возвращаемся на страницу Списка ТЗ
    }

    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);

  },

  computed: {
    blocks() {
      return this.$store.getters['assignmentBlocks/GET_BLOCKS'];
    },
    blocksTotalCount() {
      return this.blocks.length;
    },
    totalPages() {
      return Math.ceil(this.blocksTotalCount / this.itemsPerPage);
    },
    blocksFiltered() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.blocks.filter(block => {
          return [
            block.title,
            block.description,
          ].filter(e => !!e).find(value => (new RegExp(value, 'ig')).test(this.searchText));
        });
      }
      return this.blocks;
    },
    blocksSearchCount() {
      return this.blocksFiltered.length;
    },
    blocksSLice() {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = this.currentPage * this.itemsPerPage;
      return this.blocksFiltered.slice(from, to);
    },
    assignmentCustomer() {
      if (this.getSelectedAssignment?.contract?.customer) {

        const {shortName, inn} = this.getSelectedAssignment?.contract?.customer;

        if (shortName || inn) {
          return `Заказчик: ${shortName} / ${inn}`;
        }
      }
      return 'Отсутствует заказчик';
    },
    assignmentContract() {
      if (this.getSelectedAssignment?.contract) {

        const {contractNumber, contractDate} = this.getSelectedAssignment?.contract;

        if (contractNumber && contractDate) {
          return `Договор: ${contractNumber} / ${contractDate}`
        }
      }
      return 'Отсутствует договор';
    },
    getSelectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },
    fetching() {
      return this.$store.getters['assignmentBlocks/GET_FETCHING'];
    }
  },

  methods: {

    timestampToDateString,

    selectBlock(block) {
      sessionStorage.setItem('selectedAssignmentBlock', JSON.stringify(block));
      this.$store.commit('assignmentBlocks/SELECT_ITEM', block);
      navigateTo('/manager-menu/assignments/assignment/block-card');
    },

    removeBlockById(value) {
      this.$store.dispatch('assignmentBlocks/REMOVE_ITEM', value);
    },
  }
}
</script>