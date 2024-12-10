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
            <v-table height="77vh" density="default" fixed-header>
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
                  @click="selectAssignment(assignment)"
                  class="text-caption"
              >
                <td>{{ assignment.title }}</td>
                <td>
                  № {{ assignment?.contract?.contractNumber }}
                  от {{ stringToDate(assignment?.contract?.contractDate) }}
                </td>
                <td>{{ assignment?.contract?.customer?.shortName }}</td>
                <td>{{ slicer(assignment.description, 50) }}</td>
                <td style="min-width: 90px; width: 90px; max-width: 90px" >
                  <div class="d-flex ga-2">
                    <my-change-button prompt="Редактировать ТЗ" @click.stop="assignmentMenuChangeVisibility = true"/>
                    <c-remove-btn prompt="Удалить" @click:yes="removeAssignment(assignment._id)"/>
                  </div>
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

    <!--    Assignment Menu Change-->
    <v-overlay v-model="assignmentMenuChangeVisibility" class="d-flex justify-center align-center">
      <assignment-change @update:success="onChangeSuccess"
                         @click:close="this.assignmentMenuChangeVisibility = false"/>
    </v-overlay>

    <nuxt-page/>

  </v-container>
</template>

<script>
import {slicer, unixDateToShortDateString} from "../../utils/functions";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignments-page",

  data() {
    return {
      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
      assignmentAddVisibility: false,
      assignmentMenuChangeVisibility: false,
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
    this.assignmentsStoreUpdate();
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

    onChangeSuccess() {
      this.assignmentMenuChangeVisibility = false;
      this.assignmentsStoreUpdate();
    },

    assignmentsStoreUpdate() {
      this.$store.dispatch('assignments/FETCH');
    },

    onClickClose() {
      this.assignmentAddVisibility = false;
    },

    onAddSuccess() {
      this.assignmentAddVisibility = false;
    },

    stringToDate(timestamp) {
      return unixDateToShortDateString(timestamp);
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