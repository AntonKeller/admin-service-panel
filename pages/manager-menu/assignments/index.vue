<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1150">
      <v-card variant="text" :loading="getFetchingDataStatus">

        <v-card-title>Список заданий</v-card-title>

        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-calendar-check-outline"/>
          Добавляйте и контролируйте задания на осмотр
        </v-card-subtitle>

        <v-card-item/>

        <v-card-item>
          <div class="d-flex align-center">
            <v-btn
                variant="outlined"
                class="bg-blue-darken-2"
                @click="navigateToAddMenu"
            >
              Добавить
              <v-tooltip activator="parent">
                Добавить новое задание
              </v-tooltip>
            </v-btn>
            <v-spacer/>
            <v-sheet max-width="550" width="100%">
              <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
            </v-sheet>
          </div>
        </v-card-item>

        <v-card-item>
          <v-sheet class="border-sm rounded-lg bg-white px-6 pt-4 pb-1">

            <v-data-table
                :items="assignmentsSLice"
                :headers="headers"
                :search="searchText"
                class="bg-transparent"
                items-per-page-text="Кол-во на странице"
                no-data-text="Нет данных"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                show-select
            >
              <template #item.customerShortName="{ item }">
                <v-chip
                    :prepend-icon="item?.customer?.shortName ? 'mdi-domain' : ''"
                    color="blue-darken-4"
                    density="comfortable"
                    class="text-caption"
                    size="small"
                    label
                    :text="item?.customer?.shortName ?? '-'"
                />
              </template>

              <template #item.assignmentContract="{ item }">
                <v-chip
                    :prepend-icon="item?.contract ? 'mdi-domain' : ''"
                    color="deep-purple-darken-2"
                    density="comfortable"
                    class="text-caption"
                    size="small"
                    label
                    :text="getContractString(item?.contract) ?? '-'"
                />
              </template>
              <template #item.actions="{ item }">
                <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToAssignmentChange(item)"/>
                <my-button-table-remove :prompt="'Удалить'" @click:yes="removeAssignment(item._id)" class="ml-2"/>
              </template>
              <template #loading>
                <v-skeleton-loader type="table-row@10"/>
              </template>
            </v-data-table>


            <v-table style="max-height: 65vh" density="comfortable" fixed-header>
              <thead>
              <tr>
                <th>Заголовок</th>
                <th>Заказчик</th>
                <th>Договор с заказчиком</th>
                <th>Техническое задание к договору</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-if="!getFetchingDataStatus">
              <tr
                  v-for="assignment of assignmentsSLice"
                  :key="assignment._id"
                  class="text-caption row-hover"
                  @click="navigateToCardMenu(assignment)"
              >
                <td>{{ assignment.title || '-' }}</td>
                <td>
                  <v-chip color="blue-darken-3" density="comfortable" size="small" class="text-caption"
                          prepend-icon="mdi-domain" label>
                    {{ assignment.customer?.shortName || '-' }}
                  </v-chip>
                </td>
                <td>
                  <v-chip color="deep-purple-darken-2" density="comfortable" size="small" class="text-caption" label>
                    {{ getContractString(assignment.contract) }}
                  </v-chip>
                </td>
                <td>
                  <v-chip color="blue-grey-darken-2" density="comfortable" size="small" class="text-caption" label>
                    {{ getContractString(assignment.subContract) }}
                  </v-chip>
                </td>
                <td style="min-width: 95px; width: 95px; max-width: 95px">
                  <div class="d-flex ga-2">
                    <my-change-button prompt="Редактировать ТЗ" @click.stop="navigateToChangeMenu(assignment)"/>
                    <my-button-table-remove prompt="Удалить" @click:yes="removeAssignment(assignment._id)"/>
                  </div>
                </td>
              </tr>
              </tbody>
            </v-table>
          </v-sheet>
        </v-card-item>

        <v-card-item v-if="assignmentsSLice?.length === 0">
          <v-label class="d-flex justify-center pb-4 border-b-sm">
            Нет данных
          </v-label>
        </v-card-item>

        <v-card-item v-if="assignmentsSLice && assignmentsSLice?.length !== 0">
          <div class="d-flex align-center">
            <v-pagination
                v-model="currentPage"
                density="comfortable"
                color="blue-grey-darken-2"
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
import {slicer, unixDateToShortDateString} from "@/utils/functions";
import {mySearchFieldStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignments-page",

  data() {
    return {
      headers: [
        {
          align: 'start',
          key: 'title',
          value: 'title',
          sortable: true,
          title: 'Заголовок',
          nowrap: false,
        },
        {
          align: 'start',
          key: 'customerShortName',
          value: 'title',
          sortable: true,
          title: 'Заказчик',
          nowrap: false,
        },
        {
          align: 'start',
          key: 'assignmentContract',
          value: 'title',
          sortable: true,
          title: 'Договор с заказчиком',
          nowrap: false,
        },
        {
          align: 'start',
          key: 'inn',
          value: 'inn',
          sortable: true,
          title: 'Техническое задание к договору',
          nowrap: false,
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          width: 100,
        },
      ],

      searchText: '',
      currentPage: 1,
      itemsPerPage: 10,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      },
      mySearchFieldStyle
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
      return this.assignmentSearchFilter.length;
    },
    assignmentSearchFilter() {
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
      return this.assignmentSearchFilter.slice(from, to);
    },
    getFetchingDataStatus() {
      return this.$store.getters['assignments/GET_FETCHING'];
    },
  },

  methods: {

    unixDateToShortDateString,

    getContractString(contract) {
      const a = contract?.number;
      const b = contract?.date;
      if (!a && !b) return '-';
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