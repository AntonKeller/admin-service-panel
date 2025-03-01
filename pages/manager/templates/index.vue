<template>

  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Шаблоны объектов осмотра</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-calendar-check-outline" size="small"/>
          Редактируйте, создавайте шаблоны под требования заказчика
        </v-card-subtitle>
      </v-sheet>

      <v-sheet class="border-b bg-white py-4 pl-4 pr-1">
        <div class="d-flex align-center">
          <v-btn
              prepend-icon="mdi-playlist-plus"
              color="blue-accent-4"
              variant="text"
              size="small"
              rounded="md"
              border
              disabled
              @click=""
          >
            Добавить шаблон
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>
          <div class="mx-1"></div>
          <v-btn
              prepend-icon="mdi-tray-arrow-up"
              color="blue-accent-4"
              variant="text"
              size="small"
              rounded="md"
              border
              @click=""
          >
            Загрузить
            <v-tooltip activator="parent" text="Загрузить шаблон"/>
          </v-btn>

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
                <v-list-item append-icon="mdi-format-list-checks" density="compact" @click="selectedItems=[]">
                  <template #append>
                    <v-icon icon="mdi-format-list-checks" size="small"/>
                  </template>
                  <v-list-item-title>Снять выделение</v-list-item-title>
                </v-list-item>
                <v-divider/>
                <v-list-item append-icon="mdi-delete-sweep-outline" density="compact" @click="">
                  <template #append>
                    <v-icon icon="mdi-delete-sweep-outline" size="small"/>
                  </template>
                  <v-list-item-title>Удалить</v-list-item-title>
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
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="items"
          :search="searchText"
          :headers="headers"
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

      <v-overlay v-model="overlay" class="d-flex justify-center align-center">

      </v-overlay>

      <v-file-input
          class="d-none"
          ref="excelFileInput"
          accept=".xlsx"
          @change="onUploadTemplate"
      />
    </v-sheet>
  </v-container>
</template>

<script>
import {mySearchFieldStyle, myBtnPlus, myTableSheetStyle} from "../../../configs/styles";
import _ from "lodash";
import {getTemplates, uploadExcelTemplate} from "@/utils/api/templates.js";

export default {
  name: "index",
  data() {
    return {
      headers: [
        {
          align: 'start',
          key: 'name',
          sortable: true,
          title: 'Наименование',
        },
      ],
      items: [],
      selectedItems: [],
      fetching: false,
      searching: false,
      _searchText: '',
      searchText: '',
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      overlay: false,
      templates: [
        {
          _id: 1,
          name: 'Какое-то имя 1'
        },
        {
          _id: 2,
          name: 'Какое-то имя 2'
        },
        {
          _id: 3,
          name: 'Какое-то имя 3'
        },
        {
          _id: 4,
          name: 'Какое-то имя 4'
        }
      ],

      // IMPORT STYLES
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,
    }
  },

  mounted() {
    this.fetchTemplates();
  },

  watch: {
    _searchText() {
      this.searching = true;
    }
  },

  computed: {
    itemsMap() {
      return this.itemsSearchFilter;
    },
    itemsSearchFilter() {
      return this.items;
    },
  },

  methods: {
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

    fetchTemplates() {
      this.fetching = true;
      getTemplates()
          .then(response => {
            this.items = response.data;
          })
          .catch(err => {
            console.log('Ошибка получения данных', err);
            this.$store.commit('alert/ERROR', 'Ошибка получения данных');
          })
          .finally(() => {
            this.fetching = false;
          })
    },

    onUploadTemplate(event) {
      if (event.target.files && event.target.files.length > 0) {
        uploadExcelTemplate(event.target.files[0])
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Доабвлен новый шаблон');
            })
            .catch(err => {
              console.log('Ошибка добавления нового шаблона', err);
              this.$store.commit('alert/ERROR', 'Ошибка добавления нового шаблона');
            })
      }
    },

    onChangeTemplate() {

    },

    onRemoveTemplate() {

    },

    onRemoveSomeTemplates() {

    }
  }
}
</script>