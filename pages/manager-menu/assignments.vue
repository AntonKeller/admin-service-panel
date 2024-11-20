<template>
  <v-container fluid>
    <v-sheet>
      <v-card class="mx-auto" variant="text" :loading="getFetchingDataStatus">

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>

          <div class="d-flex align-center">
            <v-btn-group variant="tonal" color="blue-darken-4" density="compact">
              <v-btn
                  prepend-icon="mdi-plus-box-multiple-outline"
                  @click="assignmentAddVisibility = true"
              >
                Добавить
                <v-tooltip activator="parent">
                  Добавить новое задание
                </v-tooltip>
              </v-btn>
            </v-btn-group>
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
            <v-table height="700" density="comfortable" fixed-header>
              <thead v-if="!getFetchingDataStatus">
              <tr>
                <th>№</th>
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
                <td style="min-width: 30px; width: 30px; max-width: 30px">{{ i + 1 }}</td>
                <td style="min-width: 280px; width: 280px; max-width: 280px">
                  <div>{{ assignment.title }}</div>
                  <div><b>Создан: </b>{{ stringToDate(assignment.createdAt) }}</div>
                </td>

                <td style="min-width: 240px; width: 240px; max-width: 240px">
                  <div><b>Номер: </b>{{ assignment?.contract?.contractNumber }}</div>
                  <div><b>Заключен: </b>{{ stringToDate(assignment?.contract?.contractDate) }}</div>
                </td>
                <td style="min-width: 240px; width: 240px;max-width: 240px">
                  <div><b></b>{{ assignment?.contract?.customer?.shortName }}</div>
                  <div><b>email: </b>{{ assignment?.contract?.customer?.email }}</div>
                </td>
                <td style="min-width: 600px; width: 600px; max-width: 600px">
                  {{ slicer(assignment.description, 260) }}
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
      <assignment-add></assignment-add>
    </v-overlay>

    <nuxt-page/>

  </v-container>
</template>

<script>
import {slicer, timestampToDateString} from "../../utils/functions";
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
    console.log('assignments', this.$store.getters['assignments/GET_ASSIGNMENTS'])
  },

  unmounted() {
    this.$store.commit('assignments/RESET_STORE');
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
          return (new RegExp(this.searchText, 'ig')).test([
            item?.reatedAt || null,
            item?.description || null,
            item?.title || null,
            item?.contract?.customer?.fullName || null,
            item?.contract?.customer?.inn || null
          ].join(' '));
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
    timestampToDateString,

    stringToDate(timestamp) {
      return (new Date(parseInt(timestamp))).toLocaleDateString(undefined, this.timeDateConfig);
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