<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">
      <v-card variant="text">
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

        <v-card-subtitle>
          <div class="d-flex ga-4 flex-wrap">
            <v-label class="text-body-2">
              <v-icon icon="mdi-file-sign"/>
              <div class="ml-2 align-self-end">{{ assignmentContract }}</div>
            </v-label>
            <v-label class="text-body-2">
              <v-icon icon="mdi-text-box-outline"/>
              <div class="ml-2 align-self-end">{{ assignmentSubContract }}</div>
            </v-label>
            <v-label class="text-body-2">
              <v-icon icon="mdi-account-tie"/>
              <div class="ml-2 align-self-end">{{ assignmentCustomer }}</div>
            </v-label>
          </div>
        </v-card-subtitle>

        <v-card-item>
          <v-sheet class="text-caption rounded-lg pr-1" style="height: 80px; overflow-y: scroll">
            {{ selectedAssignment?.description }}
          </v-sheet>
        </v-card-item>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <v-btn-group variant="tonal" color="blue-darken-4" density="compact">
              <v-btn
                  prepend-icon="mdi-plus-box-multiple-outline"
                  @click="navigateToBlockCreate"
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
                variant="solo-filled"
                density="compact"
                label="Поиск"
                class="ml-2"
                hide-details
                single-line
                flat
            />
          </div>
        </v-card-item>

        <v-card-item>
          <v-divider/>
          <v-table v-if="!fetching" style="max-height: 45vh" density="comfortable" fixed-header>
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
                class="text-caption row-hover"
                @click="navigateToBlockCard(block)"
            >
              <td>{{ block?.address }}</td>
              <td style="min-width: 190px; width: 190px; max-width: 190px">
                {{ unixDateToMiddleDateString(block?.startDate) }}
              </td>
              <td>
                {{ getInspector(block?.inspector) }}
              </td>
              <td>
                {{ getInspectorContacts(block?.inspector) }}
              </td>
              <td style="min-width: 90px; width: 90px; max-width: 90px">
                <div class="d-flex ga-2">
                  <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToBlockChange(block)"/>
                  <my-button-table-remove prompt="Удалить" @click:yes="removeBlockById(block._id)"/>
                </div>
              </td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
        </v-card-item>

        <v-card-item>
          <div class="d-flex align-center">
            <v-pagination
                v-model="currentPage"
                color="blue-grey-darken-2"
                density="comfortable"
                show-first-last-page
                :length="totalPages"
                :total-visible="8"
            />
          </div>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {removeAssignmentBlock} from "@/utils/api/api_assignment_blocks";
import {fetchAssignmentOneById} from "@/utils/api/api_assignments";
import {unixDateToMiddleDateString} from "@/utils/functions";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignment-card-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 8,
      blockMenuAddVisibility: false,
    }
  },

  async beforeMount() {
    if (!this.selectedAssignment?._id) {
      this.navigateBack();
    } else {
      await fetchAssignmentOneById(this.selectedAssignment._id)
          .then((resp) => {
            this.$store.commit('assignments/SELECT', resp.data);
            sessionStorage.selectedAssignment = JSON.stringify(resp.data);
            this.$store.dispatch('assignmentBlocks/FETCH', resp.data?._id);
          })
          .catch(err => {
            console.log('Запись была удалена', err);
            sessionStorage.removeItem('selectedAssignment');
            this.$store.commit('assignments/RESET_SELECT');
            this.navigateBack();
            this.$store.commit('alert/ERROR', 'Карточка больше не существует!');
          });
    }
  },

  unmounted() {
    this.$store.commit('assignmentBlocks/RESET_BLOCK_LIST');
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
      const returnName = !this.selectedAssignment?.customer?.shortName || 'наименование отсутствует';
      const returnInn = !this.selectedAssignment?.customer?.inn || 'отсутствует';
      return `Компания: ${returnName} инн: ${returnInn}`
    },

    assignmentContract() {
      if (
          !this.selectedAssignment?.contract?.number ||
          !this.selectedAssignment?.contract?.date
      ) return `Договор не задан`;

      const {number, date} = this.selectedAssignment?.contract;
      if (number && date) return `№ ${number} от ${this.unixDateToMiddleDateString(date)}`;
      if (!number && date) return `№ [№ договора отсутствует] от ${this.unixDateToMiddleDateString(date)}`;
      if (number && !date) return `№ ${number} от [дата договора отсутствует]`;
    },

    assignmentSubContract() {
      if (
          !this.selectedAssignment?.subContract?.number ||
          !this.selectedAssignment?.subContract?.date
      ) return `ТЗ не задано`;

      const {number, date} = this.selectedAssignment?.subContract;
      if (number && date) return `ТЗ № ${number} от ${this.unixDateToMiddleDateString(date)}`;
      if (!number && date) return `ТЗ № [№ отсутствует] от ${this.unixDateToMiddleDateString(date)}`;
      if (number && !date) return `ТЗ № ${number} от [дата ТЗ отсутствует]`;
    },

    selectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },

    fetching() {
      return this.$store.getters['assignmentBlocks/GET_FETCHING'];
    },
  },

  methods: {

    // table fields
    getInspector(inspector) {
      if (!inspector?.surname && !inspector?.firstName && !inspector?.lastName) {
        return 'Отсутствует'
      }
      return `${inspector?.surname || ''} ${inspector?.firstName || ''} ${inspector?.lastName || ''}`
    },

    getInspectorContacts(inspector) {
      if (!inspector?.phoneNumber && !inspector?.email) {
        return 'Отсутствуют'
      }
      return `${inspector?.phoneNumber} | ${inspector?.email}`;
    },
    //...............

    unixDateToMiddleDateString,

    selectAssignmentBlock(block) {
      // Записываем в session storage и в vuex store
      sessionStorage.selectedAssignmentBlock = JSON.stringify(block);
      this.$store.commit('assignmentBlocks/SELECT', _.cloneDeep(block));
    },

    navigateToBlockCreate() {
      navigateTo('/manager-menu/assignments/assignment/block-create');
    },

    navigateToBlockCard(block) {
      this.selectAssignmentBlock(block);
      navigateTo('/manager-menu/assignments/assignment/block');
    },

    navigateToBlockChange(block) {
      this.selectAssignmentBlock(block);
      navigateTo('/manager-menu/assignments/assignment/block-change');
    },

    navigateBack() {
      navigateTo('/manager-menu/assignments');
    },

    removeBlockById(blockID) {
      removeAssignmentBlock(blockID)
          .then(() => {
            this.$store.commit('assignmentBlocks/REMOVE_ITEM', blockID);
            this.$store.commit('alert/SUCCESS', 'Адрес успешно удален');
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить адрес');
            +
                console.log('Ошибка удаления адреса', err);
          })
    },
  }
}
</script>