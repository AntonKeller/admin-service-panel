<template>
  <v-container fluid>
    <v-sheet class="ml-8 mt-6">
      <v-card
          variant="text"
          max-width="1024"
          :loading="getFetchingDataStatus"
      >

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>
          <div class="d-flex align-center">
            <v-btn
                variant="tonal"
                color="blue-darken-4"
                prepend-icon="mdi-plus-box-multiple-outline"
                @click="navigateToAddMenu"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить новое задание
              </v-tooltip>
            </v-btn>
            <v-sheet width="100%">
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

          <v-sheet style="min-height: 200px" class="mt-2">
            <v-table style="max-height: 77vh" density="default" fixed-header>
              <thead v-if="!getFetchingDataStatus">
              <tr>
                <th>Заголовок</th>
                <th>Договор с заказчиком</th>
                <th>Заказчик</th>
                <th>Описание</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-if="!getFetchingDataStatus">
              <tr
                  v-for="(assignment, i) of assignmentsSLice"
                  :key="assignment._id"
                  class="text-caption row-hover"
                  @click="navigateToCardMenu(assignment)"
              >
                <td>{{ assignment.title }}</td>
                <td>
                  <v-chip color="deep-purple-darken-2" density="comfortable" label>
                    {{ getContractString(assignment.contract) }}
                  </v-chip>
                </td>
                <td>
                  <v-chip color="blue-darken-3" density="comfortable" label>
                    {{ assignment?.customer?.shortName || '-' }}
                  </v-chip>
                </td>
                <td>{{ slicer(assignment.description, 50) }}</td>
                <td style="min-width: 90px; width: 90px; max-width: 90px">
                  <div class="d-flex ga-2">
                    <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToChangeMenu(assignment)"/>
                    <c-remove-btn prompt="Удалить" @click:yes="removeAssignment(assignment._id)"/>
                  </div>
                </td>
              </tr>
              </tbody>
            </v-table>
            <v-divider/>
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

      <v-snackbar :color="alert.type" v-model="alert.isShow">
        <v-icon>mdi-alert-circle-outline</v-icon>
        {{ alert.msg }}
      </v-snackbar>

    </v-sheet>
  </v-container>
</template>

<script>
import {slicer, unixDateToShortDateString} from "../../../utils/functions.js";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignments-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      }
    }
  },

  mounted() {
    this.assignmentsStoreUpdate();
  },

  unmounted() {
    this.$store.commit('assignments/RESET_ASSIGNMENT_LIST');
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
    alert() {
      return this.$store.getters['assignments/ALERT'];
    }
  },

  methods: {

    slicer,
    unixDateToShortDateString,

    getContractString(contract) {
      const a = contract?.number;
      const b = contract?.date;
      if (!a && !b) return 'Договор отсутствует';
      if (a && !b) return `№ ${contract?.number} от [дата отсутствует]`;
      if (!a && b) return `[№ отсутствует] от ${this.unixDateToShortDateString(contract?.date)}`;
      if (a && b) return `№ ${contract?.number} от ${this.unixDateToShortDateString(contract?.date)}`;
    },

    assignmentsStoreUpdate() {
      this.$store.dispatch('assignments/FETCH');
    },

    removeAssignment(_id) {
      this.$store.dispatch('assignments/REMOVE_ITEM', _id);
    },

    selectAssignment(assignment) {
      // Записываем в session storage и во vuex store
      sessionStorage.selectedAssignmentID = assignment._id;
      sessionStorage.selectedAssignment = JSON.stringify(assignment);
      this.$store.commit('assignments/SELECT', _.cloneDeep(assignment));
    },


    navigateToAddMenu() {
      navigateTo('/manager-menu/assignments/assignment-create');
    },
    navigateToCardMenu(assignment) {
      this.selectAssignment(assignment);
      navigateTo('/manager-menu/assignments/assignment');
    },
    navigateToChangeMenu(assignment) {
      this.selectAssignment(assignment);
      navigateTo('/manager-menu/assignments/assignment-change');
    }

  }
}
</script>

<style>
.row-hover:hover {
  background-color: #fffff1;
}
</style>
