<template>
  <v-container fluid>
    <v-sheet>
      <v-card class="mx-auto" variant="text" :loading="getFetchingDataStatus">

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>

          <div class="d-flex align-center">
            <v-btn
                variant="tonal"
                color="blue-darken-4"
                prepend-icon="mdi-plus-box-multiple-outline"
                @click="assignmentAddVisibility = true"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить новое задание
              </v-tooltip>
            </v-btn>
            <!--            <v-spacer />-->
            <v-sheet width="550">
              <v-text-field
                  v-model="searchText"
                  prepend-inner-icon="mdi-magnify"
                  variant="solo-filled"
                  label="Поиск заданий"
                  density="compact"
                  class="ml-2"
                  flat
                  hide-details
                  single-line
              />
            </v-sheet>
          </div>

          <v-sheet style="min-height: 600px" class="mt-2">
            <v-table height="77vh" density="comfortable" fixed-header>
              <thead v-if="!getFetchingDataStatus">
              <tr>
                <th>Заголовок</th>
                <th>Договор</th>
                <th>Заказчик</th>
                <th>Описание</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-if="!getFetchingDataStatus">
              <tr
                  v-for="(assignment, i) of assignmentsSLice"
                  :key="assignment._id"
                  @click="selectAssignment(assignment)"
              >
                <td style="max-width: 200px">
                  <div>{{ assignment.title }}</div>
                  <v-divider />
                  <div class="text-caption">{{ stringToDate(assignment.createdAt) }}</div>
                </td>

                <td style="max-width: 140px">
                  <div>Номер: {{ assignment?.contract?.contractNumber }}</div>
                  <div>Заключен: {{ stringToDate(assignment?.contract?.contractDate) }}</div>
                </td>
                <td style="max-width: 140px">
                  {{ assignment?.contract?.customer?.shortName }}
                </td>
                <td style="max-width: 200px">
                  {{ slicer(assignment.description, 50) }}
                </td>
                <td style="min-width: 65px; width: 65px; max-width: 65px">
                  <c-remove-btn :prompt="'Удалить'" @click:yes="removeAssignment(assignment._id)"/>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </v-card-item>
      </v-card>

      <div class="d-flex align-center mt-4">
        <v-pagination
            v-model="currentPage"
            density="comfortable"
            color="blue-grey-darken-2"
            show-first-last-page
            :length="totalPages"
            :total-visible="8"
        />
      </div>

    </v-sheet>

    <v-overlay v-model="assignmentAddVisibility" class="d-flex justify-center align-center">
      <assignment-add @click:close="onClickClose" @add:success="onAddSuccess"></assignment-add>
    </v-overlay>

    <nuxt-page/>

  </v-container>
</template>

<script>
import {slicer, unixDateToLongDateString, unixDateToShortDateString} from "../../utils/functions";
import _ from "lodash";

export default {
  name: "assignments-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
      assignmentAddVisibility: false,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      }
    }
  },

  beforeMount() {
    // Считываем ТЗ из session storage -> vuex store
    try {
      if (sessionStorage?.selectedAssignment) {
        this.$store.commit('assignments/SELECT', JSON.parse(sessionStorage?.selectedAssignment));
      }
    } catch (err) {
      sessionStorage.removeItem('selectedAssignment');
      console.log('[sessionStorage] Ошибка чтения selectedAssignment');
    }
  },

  mounted() {
    this.$store.dispatch('assignments/FETCH');
  },

  unmounted() {
    this.$store.commit('assignments/RESET_STORE');
  },

  watch: {
    assignmentList(newAssignments) {
      const selectedID = this.$store.getters['assignments/GET_SELECTED_ITEM']?._id;
      const selected = newAssignments.find(item => item._id === selectedID);
      if (selected) {
        this.$store.commit('assignments/SELECT', selected);
      }
    },
  },

  computed: {
    assignmentList() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'];
    },
    assignmentTotalCount() {
      return this.assignmentList.length;
    },
    assignmentFoundList() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.assignmentList.filter(item => {
          return [
            item?.title || null,
            item?.description || null,
            item?.contract?.customer?.fullName || null,
            item?.contract?.customer?.inn || null
          ].filter(e => !!e).find(field => (new RegExp(this.searchText, 'ig')).test(field));
        })
      }
      return this.assignmentList;
    },
    totalPages() {
      return Math.ceil(this.assignmentTotalCount / this.itemsPerPage);
    },
    assignmentsSLice() {
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = this.currentPage * this.itemsPerPage;
      return this.assignmentFoundList.slice(from, to);
    },

    getFetchingDataStatus() {
      return this.$store.getters['assignments/GET_FETCHING'];
    },
  },

  methods: {

    slicer,
    unixDateToLongDateString,
    unixDateToShortDateString,

    onClickClose() {
      this.assignmentAddVisibility = false;
    },

    onAddSuccess() {
      this.assignmentAddVisibility = false;
    },

    stringToDate(timestamp) {
      return unixDateToLongDateString(timestamp)
      // return (new Date(parseInt(timestamp))).toLocaleDateString(undefined, this.timeDateConfig);
    },

    selectAssignment(assignment) {
      // Записываем в session storage
      sessionStorage.setItem('selectedAssignment', JSON.stringify(assignment));
      // Записываем в vuex store
      this.$store.commit('assignments/SELECT', _.cloneDeep(assignment));
      // Открываем меню
      navigateTo('/manager-menu/assignments/assignment-card');
    },

    removeAssignment(_id) {
      this.$store.dispatch('assignments/REMOVE_ITEM', _id);
    },

  }
}
</script>