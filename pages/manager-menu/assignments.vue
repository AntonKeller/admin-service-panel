<template>
  <v-container fluid>
    <v-sheet>
      <v-card class="mx-auto" variant="text" :loading="getFetchingDataStatus">

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <my-search-bar
                :modelValue="getSearchText"
                @update:modelValue="setSearchText"
                :hint="`Найдено: ${getTotalAssignments}`"
                style="min-width: 500px"
                @btn:click="navigateTo('/manager-menu/assignments/card-add')"
            />
          </div>
        </v-card-item>
      </v-card>

      <div style="min-height: 700px" class="mt-4">
        <v-divider/>
        <v-table
            style="height: 700px"
            density="comfortable"
            class="text-caption"
            fixed-header
        >
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
              v-for="(assignment, i) of getAssignments"
              :key="assignment._id"
              @click="cardMenuShow(assignment)"
          >
            <td style="min-width: 30px; width: 30px; max-width: 30px">{{ i + 1 }}</td>
            <td style="min-width: 280px; width: 280px; max-width: 280px">
              <div>{{ assignment.title }}</div>
              <div><b>Создан: </b>{{ assignment.createdAt }}</div>
            </td>

            <td style="min-width: 240px; width: 240px; max-width: 240px">
              <div><b>Номер: </b>{{ assignment.contract.contractNumber }}</div>
              <div><b>Заключен: </b>{{ timestampToDateString(assignment.contract.contractDate) }}</div>
            </td>
            <td style="min-width: 240px; width: 240px;max-width: 240px">
              <div><b></b>{{ assignment.contract.customer.shortName }}</div>
              <div><b>email: </b>{{ assignment.contract.customer.email }}</div>
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

        <v-divider/>
      </div>

      <div class="d-flex align-center mt-4">
        <v-pagination
            :modelValue="getCurrentPage"
            @update:modelValue="setCurrentPage"
            density="comfortable"
            color="blue-grey-darken-2"
            show-first-last-page
            :length="getTotalPages"
            :total-visible="8"
        />
      </div>
    </v-sheet>

    <nuxt-page/>

  </v-container>
</template>

<script>
import {slicer, timestampToDateString} from "../../utils/functions.js";

export default {
  name: "assignments-page",

  beforeMount() {
    try {
      if (sessionStorage?.selectedAssignment) {
        let assignment = JSON.parse(sessionStorage?.selectedAssignment);
        console.log('selectedAssignment', assignment);
        this.$store.commit('assignments/SELECT_ITEM', assignment);
      }
    } catch (err) {
      console.log('Неудалось прочитать выбранный ТЗ из session storage');
    }
  },

  mounted() {
    this.$store.dispatch('assignments/UPDATE_ITEMS');
  },

  unmounted() {
    this.$store.commit('assignments/RESET_STORE');
  },

  computed: {

    getAssignments() {
      return this.$store.getters['assignments/GET_ITEMS'];
    },

    getTotalPages() {
      return this.$store.getters['assignments/GET_TOTAL_PAGES'];
    },

    getCurrentPage() {
      return this.$store.getters['assignments/GET_CURRENT_PAGE'];
    },

    getTotalAssignments() {
      return this.$store.getters['assignments/GET_TOTAL_ITEMS'];
    },

    getFetchingDataStatus() {
      return this.$store.getters['assignments/GET_FETCHING'];
    },

    getSearchText() {
      return this.$store.getters['assignments/GET_SEARCH_TEXT'];
    },
  },

  methods: {

    slicer, timestampToDateString,

    setSearchText(text) {
      this.$store.commit('assignments/SET_SEARCH_TEXT', text);
      this.$store.dispatch('assignments/UPDATE_ITEMS');
    },

    setCurrentPage(currentPage) {
      this.$store.commit('assignments/SET_CURRENT_PAGE', currentPage);
      this.$store.dispatch('assignments/UPDATE_ITEMS');
    },

    cardMenuShow(assignment) {
      this.$store.commit('assignments/SELECT_ITEM', assignment);
      sessionStorage.setItem('selectedAssignment', JSON.stringify(assignment));
      navigateTo('/manager-menu/assignments/card');
    },

    removeAssignment(_id) {
      this.$store.dispatch('assignments/REMOVE_ITEM', _id);
    },

  }
}
</script>