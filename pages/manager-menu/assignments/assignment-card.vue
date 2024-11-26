<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="back"
  >
    <v-card
        rounded="sm"
        min-width="400"
        max-width="900"
        width="100vw"
        elevation="6"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex ga-1 align-center">
            {{ getSelectedAssignment?.title }}
            <v-btn
                class="align-self-start"
                density="comfortable"
                color="blue-darken-3"
                icon="mdi-pencil"
                variant="text"
                rounded="lg"
                size="small"
                @click="assignmentMenuChangeVisibility = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Редактировать ТЗ
              </v-tooltip>
            </v-btn>
            Техническое задание
          </div>
          <my-button-close-card @click="goBack" class="align-self-start"/>
        </div>
      </v-card-title>

      <v-card-text class="d-flex flex-column ga-4 mt-2">
        <div class="d-flex ga-4 flex-wrap">
          <v-label class="text-body-2">
            <v-icon icon="mdi-file-sign"/>
            <div class="ml-2 align-self-end">{{ assignmentContract }}</div>
          </v-label>
          <v-label class="text-body-2">
            <v-icon icon="mdi-account-tie"/>
            <div class="ml-2 align-self-end">{{ assignmentCustomer }}</div>
          </v-label>
        </div>
        <v-sheet class="rounded-lg pr-1" style="height: 140px; overflow-y: scroll">
          {{ getSelectedAssignment?.description }}
        </v-sheet>
        <v-divider class="my-1"/>
        <div class="d-flex ga-4 align-center py-1">
          <v-btn-group variant="tonal" color="blue-darken-4" density="compact">
            <v-btn
                prepend-icon="mdi-plus-box-multiple-outline"
                @click="blockMenuAddVisibility = true"
            >
              Добавить блок
              <v-tooltip activator="parent">
                Добавить новый блок
              </v-tooltip>
            </v-btn>
          </v-btn-group>
          <v-text-field
              v-model="searchText"
              prepend-inner-icon="mdi-magnify"
              label="Поиск блоков заданий"
              variant="solo-filled"
              density="compact"
              class="ml-2"
              flat
              single-line
              hide-details
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
          <v-table v-if="!fetching" height="31vh" density="comfortable" fixed-header
                   class="bg-grey-lighten-4 text-caption">
            <thead>
            <tr>
              <th>Заголовок</th>
              <th>Адрес</th>
              <th>Дедлайн</th>
              <th>Инспектор</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="block of blocksSLice"
                :key="block._id"
                @click="selectBlock(block)"
            >
              <td>{{ block?.title }}</td>
              <td>{{ block?.address }}</td>
              <td style="min-width: 190px; width: 190px; max-width: 190px">
                <div><b>Начало:</b> {{ stringToDate(block?.startDate) }}</div>
                <div><b>Окончание:</b> {{ stringToDate(block?.endDate) }}</div>
              </td>
              <td>{{ block?.inspector?.surName + block?.inspector?.firstName + block?.inspector?.lastName }}</td>
              <td style="min-width: 50px; max-width: 50px">
                <c-remove-btn prompt="Удалить" @click:yes="removeBlockById(block._id)"/>
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

      <!--    Block Menu Add-->
      <v-overlay v-model="blockMenuAddVisibility" class="d-flex justify-center align-center">
        <block-add @add:success="onAddBlockSuccess" @click:close="blockMenuAddVisibility=false"/>
      </v-overlay>

      <!--    Assignment Menu Change-->
      <v-overlay v-model="assignmentMenuChangeVisibility" class="d-flex justify-center align-center">
        <assignment-change @update:success="onUpdateSuccess"
                           @click:close="this.assignmentMenuChangeVisibility = false"/>
      </v-overlay>

      <!--    Block Page Card-->
      <nuxt-page/>

      <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackBar.msg }}
      </v-snackbar>

    </v-card>
  </v-overlay>
</template>

<script>
import {removeAssignmentBlock} from "../../../utils/api/api_assignment_blocks";

export default {
  name: "assignment-card-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 8,
      snackBar: {},
      assignmentMenuChangeVisibility: false,
      blockMenuAddVisibility: false,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      }
    }
  },

  watch: {
    getSelectedAssignment() {
      let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']._id;
      if (assignmentId) {
        this.$store.dispatch('assignmentBlocks/FETCH', assignmentId);
      }
    },
  },

  beforeMount() {
    // Считываем Блок из session storage -> vuex store
    try {
      if (sessionStorage?.selectedAssignmentBlock) {
        this.$store.commit('assignmentBlocks/SELECT_ITEM', JSON.parse(sessionStorage?.selectedAssignmentBlock));
      }
    } catch (err) {
      sessionStorage.removeItem('selectedAssignmentBlock');
      console.log('[sessionStorage] Ошибка чтения selectedAssignmentBlock');
    }
  },

  mounted() {

    // Обновляем список блоков по ID ТЗ...............................................
    let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']._id;

    if (assignmentId) {
      this.$store.dispatch('assignmentBlocks/FETCH', assignmentId);
    } else {
      navigateTo('/manager-menu/assignments')
    }

    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);

    // console.log('blocksSLice', this.blocksSLice)
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
          ].filter(e => !!e).find(value => (new RegExp(this.searchText, 'ig')).test(value));
        });
      }
      return this.blocks;
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
          return `Договор: ${contractNumber} / ${this.stringToDate(contractDate)}`
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
    onAddBlockSuccess() {
      this.blockMenuAddVisibility = false;
      this.assignmentBlocksStoreUpdate();
    },
    onUpdateSuccess() {
      this.assignmentMenuChangeVisibility = false;
      this.assignmentBlocksStoreUpdate();
    },
    goBack() {
      navigateTo('/manager-menu/assignments');
    },
    stringToDate(timestamp) {
      return (new Date(parseInt(timestamp))).toLocaleDateString(undefined, this.timeDateConfig);
    },

    assignmentBlocksStoreUpdate() {
      let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']._id;

      if (assignmentId) {
        this.$store.dispatch('assignmentBlocks/FETCH', assignmentId);
      }
    },

    selectBlock(block) {
      // Записываем в session storage
      sessionStorage.setItem('selectedAssignmentBlock', JSON.stringify(block));
      // Записываем в vuex store
      this.$store.commit('assignmentBlocks/SELECT_ITEM', block);
      // Открываем меню
      navigateTo('/manager-menu/assignments/assignment-card/block');
    },

    removeBlockById(blockID) {

      console.log('Removed block')

      removeAssignmentBlock(blockID)
          .then(() => {
            this.$store.commit('assignmentBlocks/REMOVE_ITEM', blockID);
            console.log('Removed block success');
          })
          .catch(err => {
            console.log('Ошибка удаления Блока', err);
          })
    },
    back() {
      navigateTo('/manager-menu/assignments')
    }
  }
}
</script>