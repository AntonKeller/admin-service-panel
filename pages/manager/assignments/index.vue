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
            <v-btn v-bind="myBtnPlus" @click="onAddAssignment">
              Добавить
              <v-tooltip activator="parent">
                Добавить новое задание
              </v-tooltip>
            </v-btn>
            <v-spacer/>
            <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
          </div>
        </v-card-item>

        <v-card-item>
          <v-sheet v-bind="myTableSheetStyle">
            <v-data-table
                v-model="selectedItems"
                v-model:items-per-page="itemsPerPage"
                :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage"
                :items="assignmentsMap"
                :search="searchText"
                :headers="headers"
                style="max-height: 600px"
                items-per-page-text="Кол-во на странице"
                loading-text="Загрузка данных..."
                no-data-text="Нет данных"
                class="bg-transparent"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                show-select
                @update:current-items="this.selectedItems = []"
            >
              <template #item.customerShortName="{ item }">
                <v-chip
                    :prepend-icon="item?.customer?.shortName ? 'mdi-domain' : ''"
                    :text="item.customerShortName"
                    color="blue-darken-4"
                    density="comfortable"
                    class="text-caption"
                    size="small"
                    label
                />
              </template>

              <template #item.assignmentContract="{ item }">
                <v-chip
                    :prepend-icon="item?.contract ? 'mdi-domain' : ''"
                    :text="item.assignmentContract"
                    color="deep-purple-darken-2"
                    density="comfortable"
                    class="text-caption"
                    size="small"
                    label
                />
              </template>

              <template #item.actions="{ item }">
                <v-btn
                    icon="mdi-open-in-new"
                    density="comfortable"
                    color="deep-orange"
                    variant="text"
                    size="small"
                    @click.stop="onOpenAssignmentCard(item._id)"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="left">
                    Открыть карточку
                  </v-tooltip>
                </v-btn>
                <my-change-button
                    class="ml-2"
                    prompt="Редактировать ТЗ"
                    @click.stop="onChangeAssignment(item._id)"
                />
                <my-button-table-remove
                    :prompt="'Удалить'"
                    class="ml-2"
                    @click:yes="onRemoveAssignment(item._id)"
                />
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-item>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {unixDateToShortDateString} from "@/utils/functions";
import {mySearchFieldStyle, myBtnPlus, myTableSheetStyle} from "../../../configs/styles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";
import {addNewAssignment} from "../../../utils/api/api_assignments";

export default {
  name: "assignments-page",

  data() {
    return {
      selectedItems: [],
      headers: [
        {
          title: 'Заголовок',
          align: 'start',
          key: 'title',
          value: 'title',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Заказчик',
          align: 'start',
          key: 'customerShortName',
          value: 'customerShortName',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Договор с заказчиком',
          align: 'start',
          key: 'assignmentContract',
          value: 'assignmentContract',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Техническое задание к договору',
          align: 'start',
          key: 'subContract',
          value: 'subContract',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          minWidth: 150,
          maxWidth: 150,
          width: 150,
          nowrap: true,
        },
      ],
      searchText: '',
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      },
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      // IMPORT STYLES
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  mounted() {
    this.assignmentsStoreUpdate();
  },

  unmounted() {
    this.$store.commit('assignments/RESET_ASSIGNMENT_LIST');
  },

  computed: {
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'];
    },
    assignmentsMap() {
      return this.assignmentsSearchFilter.map(e => ({
        _id: e?._id,
        title: e?.title ?? '-',
        customerShortName: e?.customer?.shortName ?? '-',
        assignmentContract: this.getContractString(e.contract),
        subContract: this.getContractString(e.subContract),
      }))
    },
    assignmentsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.assignments.filter(item => {
          return [
            item?.title || null,
            item?.description || null,
            item?.contract?.customer?.fullName || null,
            item?.contract?.customer?.inn || null
          ].filter(e => !!e).find(field => (new RegExp(this.searchText, 'ig')).test(field));
        })
      }
      return this.assignments;
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

    onAddAssignment() {
      const assignment = {
        _id: null, // _id - всегда null при добавлении
        title: '[пустое задание]', // Заголовок задачи
        customer: null, // Заказчик
        contract: null, // Договор
        subContract: null, // Техническое задание
        loanAgreements: null, // Кредитный договор
        pledgeAgreements: null, // Договор залога
      }
      addNewAssignment(assignment)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Задание добавлено');
            this.$store.dispatch('assignments/FETCH');
          })
          .catch((err) => {
            this.$store.commit('alert/ERROR', 'Ошибка добавления');
          })
          .finally(() => {
            this.selectedItems = [];
          })
    },

    onChangeAssignment(id) {
      navigateTo(`/manager/assignments/${id}/change`);
    },

    onOpenAssignmentCard(id) {
      navigateTo(`/manager/assignments/${id}/`);
    },

    onRemoveAssignment(id) {
      this.$store.dispatch('assignments/REMOVE_ITEM', id);
    },

  }
}
</script>