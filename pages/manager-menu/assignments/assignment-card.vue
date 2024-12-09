<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="back"
  >
    <v-card
        min-width="400"
        max-width="1024"
        width="100vw"
        elevation="6"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex ga-1 align-center">
            {{ getSelectedAssignment?.title }}
             [ Техническое задание ]
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
              Добавить адрес
              <v-tooltip activator="parent">
                Добавить новый адрес нас осмотр
              </v-tooltip>
            </v-btn>
          </v-btn-group>
          <v-text-field
              v-model="searchText"
              prepend-inner-icon="mdi-magnify"
              label="Поиск"
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
            >
              загрузка...
            </v-progress-circular>
          </div>
          <v-table v-if="!fetching" height="31vh" density="comfortable" fixed-header
                   class="bg-grey-lighten-4 text-caption">
            <thead>
            <tr>
              <th>Адрес</th>
              <th>Начало</th>
              <th>Инспектор</th>
              <th>Контакты инспектора</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="block of blocksSLice"
                :key="block._id"
                @click="selectBlock(block)"
            >
              <td>{{ block?.address }}</td>
              <td style="min-width: 190px; width: 190px; max-width: 190px">
                {{ stringToDate(block?.startDate) }}
              </td>
              <td>
                {{ block?.inspector?.surName + ' ' + block?.inspector?.firstName + ' ' + block?.inspector?.lastName }}
              </td>
              <td>
                <div>
                  {{ block?.inspector?.phoneNumber || '-' }}
                </div>
                <div>
                  {{ block?.inspector?.email || '-' }}
                </div>
              </td>
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
import {unixDateToMiddleDateString} from "../../../utils/functions.js";
import {navigateTo} from "nuxt/app";

export default {
  name: "assignment-card-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 8,
      snackBar: {},

      blockMenuAddVisibility: false,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        // year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      }
    }
  },

  watch: {
    blocks(_newArray) {
      // Определяем последний выбранный блок
      const blockID = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']?._id;
      // Находим его в массиве
      const foundBlock = _newArray.find(block => block._id === blockID)
      if (foundBlock) {
        // Заменяем его новым
        this.$store.commit('assignmentBlocks/SELECT_ITEM', foundBlock);
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
    let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']?._id;

    if (assignmentId) {
      this.$store.dispatch('assignmentBlocks/FETCH', assignmentId);
    } else {
      navigateTo('/manager-menu/assignments')
    }

    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);

    // console.log('assignment blocks', this.blocks)
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
    goBack() {
      navigateTo('/manager-menu/assignments');
    },

    stringToDate(timestamp) {
      return (new Date(parseInt(timestamp))).toLocaleDateString(undefined, this.timeDateConfig);
    },

    assignmentBlocksStoreUpdate() {
      let assignmentId = this.$store.getters['assignments/GET_SELECTED_ITEM']?._id;

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
      console.log('[Block card] Select block ')
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