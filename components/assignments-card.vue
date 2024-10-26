<template>
  <v-sheet
      height="700px"
      width="1024px"
      elevation="6"
      rounded="lg"
  >
    <v-card rounded="lg" variant="text">
      <v-card-title>
        <div class="d-flex justify-space-between">
          <div>{{ getSelectedAssignment?.title }}</div>
          <div>
            <v-btn
                density="comfortable"
                color="blue-darken-1"
                rounded
                icon="mdi-pencil"
                @click="navigateTo('/manager-menu/assignments/card-change')"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Редактировать
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
              rounded="lg"
              border="sm"
          >
            {{
              getSelectedAssignment?.contract?.contractNumber && getSelectedAssignment?.contract?.contractDate ?
                  `Договор: ${getSelectedAssignment?.contract?.contractNumber} / ${getSelectedAssignment?.contract?.contractDate}` :
                  'Отсутствует договор'
            }}
          </v-chip>


          <v-chip
              prepend-icon="mdi-account-tie"
              color="blue-grey-darken-2"
              density="comfortable"
              rounded="lg"
              border="sm"
          >
            {{
              getSelectedAssignment?.contract?.customer?.shortName && getSelectedAssignment?.contract?.customer?.inn ?
                  `Заказчик: ${getSelectedAssignment?.contract?.customer?.shortName} / ${getSelectedAssignment?.contract?.customer?.inn}` :
                  'Отсутствует заказчик'
            }}
          </v-chip>

        </div>
        <v-sheet class="rounded-lg px-2 py-2" style="height: 140px; overflow-y: scroll">
          {{ getSelectedAssignment?.description }}
        </v-sheet>
        <v-divider class="my-1"/>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              style="min-width: 360px"
              label="Поиск"
              persistent-hint
              :hint="`Найдено: ${getTotalItems}`"
              :modelValue="getSearchText"
              @update:modelValue="setSearchText"
              @btn:click="navigateTo('/manager-menu/assignments/card/block-add')"
          />
        </div>
        <v-sheet>
          <v-divider/>
          <div v-if="getFetchingDataStatus" class="d-flex align-center justify-center h-100">
            <v-progress-circular
                :size="140"
                :width="3"
                color="teal"
                indeterminate
            >загрузка...
            </v-progress-circular>
          </div>
          <v-table v-if="!getFetchingDataStatus" height="290px" fixed-header density="default" class="text-caption">
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
                v-for="block of getAssignmentBlocks"
                :key="block._id"
                @click="selectBlock(block)"
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
                <c-remove-btn :prompt="'Удалить'" @click:yes="removeBlockById(block._id)"/>
              </td>
            </tr>
            </tbody>
          </v-table>
          <v-divider/>
          <div class="d-flex align-center mt-4">
            <v-pagination
                color="blue-grey-darken-2"
                density="comfortable"
                show-first-last-page
                @update:modelValue="setCurrentPage"
                :modelValue="getCurrentPage"
                :length="getTotalPages"
                :total-visible="8"
            />
          </div>
        </v-sheet>
      </v-card-text>
    </v-card>

    assignment-card
    <nuxt-page/>

    <!--      TODO: Сделать nuxt-page -->
    <!--      <my-overlay v-model="aBlockCardMenuIsShow">-->
    <!--        <c-a-block-card :_assignmentId="getSelectedAssignment._id" :_assignmentBlock="selectedBlock"/>-->
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
import {timeStringToDate} from "../utils/functions.js";

export default {
  name: "assignments-card",

  data: () => ({
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
    console.log('[assignment-card] selected assignmentID:', assignmentId);

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

    getSelectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },

    getAssignmentBlocks() {
      return this.$store.getters['assignmentBlocks/GET_ITEMS'];
    },

    getSearchText() {
      return this.$store.getters['assignmentBlocks/GET_SEARCH_TEXT'];
    },

    getCurrentPage() {
      return this.$store.getters['assignmentBlocks/GET_CURRENT_PAGE'];
    },

    getTotalPages() {
      return this.$store.getters['assignmentBlocks/GET_TOTAL_PAGES'];
    },

    getTotalItems() {
      return this.$store.getters['assignmentBlocks/GET_TOTAL_ITEMS'];
    },

    getFetchingDataStatus() {
      return this.$store.getters['assignmentBlocks/GET_FETCHING'];
    }

  },

  methods: {

    timeStringToDate,

    navigateBack() {
      const router = useRouter();
      router.back();
    },

    selectBlock(block) {
      sessionStorage.setItem('selectedAssignmentBlock', JSON.stringify(block));
      this.$store.dispatch('assignmentBlocks/SELECT_ITEM', block);
      navigateTo('/manager-menu/assignments/card/block-change');
    },

    removeBlockById(value) {
      this.$store.dispatch('assignmentBlocks/REMOVE_ITEM', value);
    },

    setSearchText(value) {
      this.$store.commit('assignmentBlocks/SET_SEARCH_TEXT', value);
      this.$store.dispatch('assignmentBlocks/UPDATE_ITEMS', this.getSelectedAssignment?._id);
    },

    setCurrentPage(value) {
      this.$store.commit('assignmentBlocks/SET_CURRENT_PAGE', value);
    }

  }
}
</script>