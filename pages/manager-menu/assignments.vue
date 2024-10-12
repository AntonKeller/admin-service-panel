<template>
  <v-container fluid>
    <v-sheet>
      <v-card class="mx-auto" variant="text" :loading="getFetchingDataStatus">

        <v-card-title>Список заданий</v-card-title>

        <v-card-item>
          <div class="d-flex ga-4 align-center">
            <my-search-bar
                :modelValue=""
                v-model="searchText"
                :hint="`Найдено: ${totalItems}`"
                style="min-width: 500px"
                @btn:click="navigateTo('/manager-menu/assignments/assignment-card-add')"
                @update:modelValue="fetchData"
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
            <!--            @click="cardMenuShow(assignment._id)"-->
            <td style="min-width: 30px; width: 30px; max-width: 30px">{{ i }}</td>
            <td style="min-width: 280px; width: 280px; max-width: 280px">
              <div>{{ assignment.title }}</div>
              <div><b>Создан: </b>{{ assignment.createdAt }}</div>
            </td>

            <td style="min-width: 240px; width: 240px; max-width: 240px">
              <div><b>Номер: </b>{{ assignment.contract.contractNumber }}</div>
              <div><b>Заключен: </b>{{ timeStringToDate(assignment.contract.contractDate).toLocaleDateString() }}</div>
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
        <v-text-field
            v-model="currentPage"
            color="blue-grey-darken-3"
            variant="outlined"
            density="compact"
            type="number"
            rounded="lg"
            hide-details
            style="width: 80px; max-width: 80px"
            @update:modelValue="fetchData"
        />
        <v-pagination
            v-model="currentPage"
            density="comfortable"
            color="blue-grey-darken-2"
            show-first-last-page
            :length="totalPages"
            :total-visible="8"
            @update:modelValue="fetchData"
        />
      </div>
    </v-sheet>

    <nuxt-page/>

  </v-container>
</template>

<script>
import _ from "lodash";
import dataAssignments from "../../configs/data-test/data-test-assignments";
import {slicer, timeStringToDate} from "../../utils/service/serverAPI";
import {removeAssignment} from "../../utils/service/server";

export default {
  name: "assignments-page",

  data() {
    return {
      currentPage: 1,
      itemsLimit: 50,
      totalItems: 1,
      totalPages: 1,
      searchText: '',
    }
  },

  computed: {
    getAssignments() {
      return this.$store.getters['assignments/GET_ITEMS'];
    },
    getFetchingDataStatus() {
      return this.$store.getters['assignments/GET_FETCHING'];
    },
    getSelectedAssignment() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    },
    getSearchText() {
      return this.$store.getters['assignments/GET_SELECTED_ITEM'];
    }
  },

  // watch: {
  //   data() {
  //     let assignment = this.$store.state.selectedAssignment;
  //     if (assignment && assignment?._id) {
  //       let foundAssignment = this.data.find(e => e._id === assignment._id);
  //       if (foundAssignment) {
  //         // Пишем в стор активное ТЗ
  //         this.$store.dispatch('selectAssignment', foundAssignment);
  //         // Пишем в локальное хранилище активное ТЗ
  //         sessionStorage.setItem('selectedAssignment', JSON.stringify(foundAssignment));
  //       }
  //     }
  //   },
  // },

  mounted() {

    this.$store.dispatch['assignments/UPDATE_ITEMS'];

    // Загружаем selectedAssignment зи localStorage
    let assignment = sessionStorage.getItem('selectedAssignment');
    if (assignment) {
      this.$store.dispatch('selectAssignment', JSON.parse(assignment));
    }
  },

  unmounted() {
    this.$store.commit('assignments/RESET_STORE');
  },

  methods: {

    timeStringToDate,
    slicer,

    cardMenuShow(assignment) {
      this.$store.commit('assignments/SELECT_ITEM', assignment);
      sessionStorage.setItem('selectedAssignment', JSON.stringify(assignment));
      navigateTo('/manager-menu/assignments/assignment-card');
    },

    removeAssignment(_id) {
      this.$store.dispatch('assignments/REMOVE_ITEM', _id);
    },
  }
}
</script>