<template>
  <v-container fluid>
    <v-sheet class="ml-8 mt-6">
      <v-card
          variant="text"
          min-width="400"
          max-width="1024"
      >
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex ga-1 align-center">
              {{ selectedAssignment?.title }}
              [ Техническое задание ]
            </div>
            <v-btn
                density="comfortable"
                color="blue-grey-darken-2"
                icon="mdi-arrow-left"
                variant="text"
                rounded="lg"
                @click="navigateBack"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Назад
              </v-tooltip>
            </v-btn>
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
            {{ selectedAssignment?.description }}
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
    </v-sheet>
  </v-container>
</template>

<script>
import {removeAssignmentBlock} from "../../utils/api/api_assignment_blocks";
import {unixDateToMiddleDateString} from "../../utils/functions";
import {navigateTo} from "nuxt/app";
import {fetchAssignmentOneById} from "../../utils/api/api_assignments.js";
import _ from "lodash";

export default {
  name: "assignment-card-page",

  data() {
    return {
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

  async beforeMount() {

    if (!this.selectedAssignment?._id) {
      this.navigateBack();
    } else {
      await fetchAssignmentOneById(this.selectedAssignment._id)
          .then((resp) => {
            console.log('[beforeMount] init selected assignment: req answer', resp);
            this.$store.commit('assignments/SELECT', resp.data);
            sessionStorage.selectedAssignment = JSON.stringify(resp.data);
            this.$store.dispatch('assignmentBlocks/FETCH', resp.data?._id);
          })
          .catch(err => {
            console.log('Запись была удалена', err);
            sessionStorage.removeItem('selectedAssignment');
            this.$store.commit('assignments/RESET_SELECT');
            this.navigateBack();
            this.$store.commit('assignments/ALERT_ERROR', 'К сожалению карточка больше не существует!');
          });
    }
  },

  watch: {
    blocks(_newArray) {
      // Определяем последний выбранный блок
      const blockID = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']?._id;
      // Находим его в массиве
      const foundBlock = _newArray?.find(block => block._id === blockID);
      if (foundBlock) {
        // Заменяем его новым
        this.$store.commit('assignmentBlocks/SELECT', foundBlock);
      }
    },
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

    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'] || [];
    },

    assignmentCustomer() {
      if (!this.selectedAssignment?.customer) return 'Заказчик отсутствует';

      const {
        shortName, fullName, inn, phoneNumber, email, address,
        representativePosition, representativeFullName
      } = this.selectedAssignment.customer;

      const returnName = shortName || fullName || email || phoneNumber || 'наименование отсутствует';
      return `Компания: ${returnName} инн: ${inn}`
    },

    assignmentContract() {
      if (!this.selectedAssignment?.contract) return `Договор не задан`;
      const {number, date} = this.selectedAssignment?.contract;
      if (number && date) return `№ ${number} от ${this.unixDateToMiddleDateString(date)}`;
      if (!number && date) return `№ [№ договора отсутствует] от ${this.unixDateToMiddleDateString(date)}`;
      if (number && !date) return `№ ${number} от [дата договора отсутствует]`;
    },

    selectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },

    fetching() {
      return this.$store.getters['assignmentBlocks/GET_FETCHING'];
    }
  },

  methods: {

    unixDateToMiddleDateString,

    onAddBlockSuccess() {
      this.blockMenuAddVisibility = false;
      this.assignmentBlocksStoreUpdate();
    },

    navigateBack() {
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
      sessionStorage.selectedAssignmentBlock = JSON.stringify(block);
      // Записываем в vuex store
      this.$store.commit('assignmentBlocks/SELECT', block);
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