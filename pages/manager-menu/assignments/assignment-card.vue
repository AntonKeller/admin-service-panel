<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="back"
  >
    <v-sheet
        height="700px"
        width="1024px"
        elevation="6"
        rounded="sm"
    >
      <v-card rounded="sm" variant="text">
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
            </div>
            <my-button-close-card @click="goBack"/>
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
            <!--            <my-search-bar-->
            <!--                v-model="searchText"-->
            <!--                style="min-width: 360px"-->
            <!--                persistent-hint-->
            <!--                label="Поиск"-->
            <!--                :hint="`Найдено: ${blocksSearchCount}`"-->
            <!--                @btn:click="blockMenuAddVisibility = true"-->
            <!--            />-->
            <v-btn-group variant="tonal" color="blue-darken-4" density="compact">
              <v-btn
                  prepend-icon="mdi-plus-box-multiple-outline"
                  @click="blockMenuAddVisibility = true"
              >
                Добавить
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
            <v-table v-if="!fetching" height="310" density="default" fixed-header class="text-caption">
              <thead>
              <tr>
                <th>Заголовок</th>
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
                <td style="min-width: 180px; max-width: 180px">{{ block.title }}</td>


                <td style="min-width: 180px; max-width: 180px">
                  <div><b>Номер: </b>{{ block.loanAgreement }}</div>
                  <v-divider/>
                  <div class="text-caption font-weight-bold">{{ stringToDate(block.loanAgreementDate) }}</div>
                </td>
                <td style="min-width: 180px; max-width: 180px">
                  <div><b>Номер: </b>{{ block.pledgeAgreement }}</div>
                  <v-divider/>
                  <div class="text-caption font-weight-bold">{{ stringToDate(block.pledgeAgreementDate) }}</div>
                </td>
                <td style="min-width: 190px; max-width: 190px">
                  <div><b>С:</b> {{ stringToDate(block.startDate) }}</div>
                  <div><b>По:</b> {{ stringToDate(block.endDate) }}</div>
                </td>
                <td style="min-width: 120px; max-width: 120px">
                  {{ block.status }}
                </td>
                <td style="min-width: 35px; max-width: 35px">
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

      <!--    Assignment Menu Change-->
      <v-overlay v-model="assignmentMenuChangeVisibility" class="d-flex justify-center align-center">
        <assignment-change @click:close="assignmentMenuChangeVisibility=false"/>
      </v-overlay>

      <!--    Block Menu Add-->
      <v-overlay v-model="blockMenuAddVisibility" class="d-flex justify-center align-center">
        <block-add @add:success="assignmentBlocksStoreUpdate" @click:close="blockMenuAddVisibility=false"/>
      </v-overlay>

      <!--    Block Page Card-->
      <nuxt-page/>

      <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ snackBar.msg }}
      </v-snackbar>

    </v-sheet>
  </v-overlay>
</template>

<script>
export default {
  name: "assignment-card-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 2,
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
          ].filter(e => !!e).find(value => (new RegExp(this.searchText, 'ig')).test(value));
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

    removeBlockById(value) {
      this.$store.dispatch('assignmentBlocks/REMOVE_ITEM', value);
    },
    back() {
      navigateTo('/manager-menu/assignments')
    }
  }
}
</script>