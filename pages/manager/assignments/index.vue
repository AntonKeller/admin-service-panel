<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Список заданий</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-calendar-check-outline" size="small"/>
          Добавляйте и контролируйте задания на осмотр
        </v-card-subtitle>
      </v-sheet>

      <v-sheet class="border-b bg-white py-4 pl-4 pr-1">
        <div class="d-flex align-center">
          <v-btn
              class="border rounded "
              prepend-icon="mdi-playlist-plus"
              color="blue-accent-4"
              variant="text"
              size="small"
              @click="onAddAssignment"
          >
            Добавить задание
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>
<!--          <v-btn-->
<!--              class="border-e border-t border-b rounded rounded-s-0"-->
<!--              icon="mdi-chevron-down"-->
<!--              color="blue-accent-4"-->
<!--              variant="text"-->
<!--              density="comfortable"-->
<!--              size="small"-->
<!--          >-->
<!--            <v-icon />-->
<!--            <v-tooltip activator="parent" text="Добавить новую запись"/>-->
<!--          </v-btn>-->

          <div class="mx-2"></div>

          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!selectedItems.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="selectedItems=[]"
                >
                  <template #append>
                    <v-icon icon="mdi-format-list-checks" size="small"/>
                  </template>
                  <v-list-item-title>Снять выделение</v-list-item-title>
                </v-list-item>
                <v-divider/>
                <v-list-item
                    append-icon="mdi-delete-sweep-outline"
                    density="compact"
                    @click=""
                >
                  <template #append>
                    <v-icon icon="mdi-delete-sweep-outline" size="small"/>
                  </template>
                  <v-list-item-title>Удалить выделенные</v-list-item-title>
                  <v-menu activator="parent" location="top right" width="205">
                    <v-sheet class="elevation-0 rounded-lg border-sm px-4 py-3">
                      <div>Подтвердите удаление</div>
                      <v-divider class="my-3 "/>
                      <div class="d-flex align-center ga-1">
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            border="sm"
                            text="Ок"
                            @click="onRemoveSomeAssignments"
                        />
                        <v-btn
                            density="comfortable"
                            class="rounded-lg"
                            variant="flat"
                            size="small"
                            text="Отмена"
                        />
                      </div>
                    </v-sheet>
                  </v-menu>
                </v-list-item>
              </v-sheet>
            </v-menu>
          </v-btn>

          <div class="mx-1"></div>

          <v-btn
              :loading="fetching"
              prepend-icon="mdi-update"
              variant="text"
              size="small"
              rounded="md"
              border
              @click="updateTable"
          >
            Обновить
            <v-tooltip activator="parent" text="Обновить данные"/>
          </v-btn>

          <v-spacer/>

          <v-progress-circular
              v-if="searching"
              color="grey"
              size="25"
              indeterminate
          />

          <v-text-field
              v-model="_searchText"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
              @update:modelValue="updateSearch"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="selectedItems"
          v-model:items-per-page="configAssignmentsPage.itemsPerPage"
          :items-per-page-options="configAssignmentsPage.itemsPerPageOptions"
          :items-per-page="configAssignmentsPage.itemsPerPage"
          :items="assignmentsMap"
          :search="searchText"
          :headers="configAssignmentsPage.tableHeaders"
          style="max-height: 500px"
          items-per-page-text="Кол-во на странице"
          loading-text="Загрузка данных..."
          no-data-text="Нет данных"
          class="bg-transparent"
          density="comfortable"
          items-per-page="5"
          item-value="_id"
          fixed-header
          show-select
          @update:current-items="selectedItems = []"
      >
        <template #item.title="{ item }">
          <v-icon
              icon="mdi-label-multiple-outline"
              size="small"
              color="grey-darken-1"
              class="mr-1"
          />
          {{ item?.title ?? '-' }}
        </template>


        <template #item.customerShortName="{ item }">
          <v-chip
              :prepend-icon="item?.customer?.shortName ? 'mdi-domain' : ''"
              :text="item.customerShortName"
              color="blue-darken-4"
              class="text-caption"
              density="compact"
              size="small"
              label
          />
        </template>

        <template #item.assignmentContract="{ item }">
          <v-chip
              :prepend-icon="item?.contract ? 'mdi-domain' : ''"
              :text="item.assignmentContract"
              color="deep-purple-darken-2"
              class="text-caption"
              density="compact"
              size="small"
              label
          />
        </template>

        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
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

        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedItems.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selectedItems.length }}
          </div>
        </template>
      </v-data-table>
    </v-sheet>
  </v-container>
</template>

<script>
import {addNewAssignment, removeAssignment, removeAssignments} from "../../../utils/api/api_assignments";
import {mySearchFieldStyle, myBtnPlus, myTableSheetStyle} from "../../../configs/styles";
import configAssignmentsPage from "@/configs/configAssignmentsPage";
import {unixDateToShortDateString} from "@/utils/functions";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "assignments-page",

  data() {
    return {
      selectedItems: [],
      _searchText: '',
      searchText: '',
      fetching: false,
      searching: false,
      timeDateConfig: {
        weekday: 'short', // weekday: 'short',
        year: 'numeric',
        month: 'short', // month: 'short',
        day: 'numeric',
      },

      // IMPORT STYLES
      configAssignmentsPage,
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  watch: {
    _searchText() {
      this.searching = true;
    }
  },

  mounted() {
    this.assignmentsStoreUpdate();
  },

  computed: {
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
    assignments() {
      return this.$store.getters['assignments/GET_ASSIGNMENTS'];
    },
  },

  methods: {

    unixDateToShortDateString,

    updateTable() {
      this.fetching = true;
      const timeoutId = setTimeout(() => {
        this.$store.dispatch('assignments/FETCH');
        this.fetching = false;
        clearTimeout(timeoutId);
      }, 500)
    },

    updateSearch: _.debounce(function (search) {
      this.searchText = search;
      this.searching = false;
    }, 900),

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
          .catch(() => {
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

    onRemoveSomeAssignments() {
      if (!this.selectedItems || this.selectedItems.length === 0) return;
      removeAssignments(this.selectedItems)
          .then(() => {
            this.assignmentsStoreUpdate();
            this.$store.commit('alert/SUCCESS', 'Записи удалены');
          })
          .catch(err => {
            console.log('Ошибка удаления', err);
            this.$store.commit('alert/ERROR', 'Ошибка удаления');
          })
    },

    onRemoveAssignment(id) {
      removeAssignment(id)
          .then(() => {
            this.selectedItems = [];
            this.$store.commit('alert/SUCCESS', 'Успешно удалено');
            this.$store.dispatch('assignments/FETCH');
          })
          .catch(err => {
            console.log('Не удалось удалить', err);
            this.$store.commit('alert/ERROR', 'Не удалось удалить');
          })
    },

  }
}
</script>