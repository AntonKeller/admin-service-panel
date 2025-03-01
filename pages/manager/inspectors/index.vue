<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Инспекторы</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-badge-account-outline" size="small"/>
          Добавляйте, редактируйте данные ваших сюрвейеров
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
              @click="onAddInspector"
          >
            Добавить инспектора
            <v-tooltip activator="parent" text="Добавить новую запись"/>
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
                  <v-list-item-title>Удалить</v-list-item-title>
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
                            @click="onRemoveSomeInspectors"
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
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="itemsSearchFilter"
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
        <template #item.name="{ item }">
          {{ getFullName(item) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <my-change-button prompt="Редактировать ТЗ" @click.stop="onChangeInspector(item._id)"/>
          <my-button-table-remove :prompt="'Удалить'" @click:yes="onRemoveInspector(item._id)" class="ml-2"/>
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
import {addInspector, fetchInspectors, removeInspector, removeSomeInspectors} from "@/utils/api/api_inspectors";
import {myBtnPlus, mySearchFieldStyle, myTableSheetStyle} from "@/configs/styles";
import _ from "lodash";

export default {
  name: "inspectors-page",

  data() {
    return {
      headers: [
        {
          align: 'start',
          key: 'name',
          value: 'surname',
          sortable: true,
          title: 'ФИО Инспектора',

        },
        {
          align: 'start',
          key: 'phoneNumber',
          sortable: true,
          title: 'Номер телефона',
        },
        {
          align: 'start',
          key: 'email',
          sortable: true,
          title: 'Email',
        },
        {
          align: 'end',
          key: 'actions',
          sortable: false,
          width: 100,
        },
      ],
      items: [],
      selectedItems: [],
      fetching: false,
      _searchText: '',
      searchText: '',
      searching: false,
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
    this.fetchInspectors();
  },

  watch: {
    _searchText() {
      this.searching = true;
    }
  },

  computed: {
    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        const ex = new RegExp(this.searchText, 'ig');
        return this.items.filter(e => {
          return ex.test([
            e?.firstName || null,
            e?.surname || null,
            e?.lastName || null,
            e?.phoneNumber || null,
            e?.email || null
          ].filter(e => !!e).join(' '));
        })
      } else {
        return this.items;
      }
    },
  },

  methods: {

    updateSearch: _.debounce(function (search) {
      this.searchText = search;
      this.searching = false;
    }, 900),

    updateTable() {
      this.fetching = true;
      const timeoutId = setTimeout(() => {
        this.fetchInspectors();
        clearTimeout(timeoutId);
      }, 500)
    },

    getFullName(user) {
      return (user?.surname ? `${user?.surname}` : '') +
          (user?.firstName ? ` ${user?.firstName}` : '') +
          (user?.lastName ? ` ${user?.lastName}` : '');
    },

    onAddInspector() {
      const inspector = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
        email: null,
        login: null,
        password: null,
      }
      addInspector(inspector)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Добавлен новый инспектор');
            this.fetchInspectors();
          })
          .catch((err) => {
            console.log('Ошибка добавление инспектора', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавление инспектора');
          })
          .finally(() => {
            this.sending = false;
            this.selectedItems = [];
          })
    },

    fetchInspectors() {
      this.fetching = true;
      fetchInspectors()
          .then(response => {
            this.items = response.data;
          })
          .catch(err => {
            console.log('Ошибка получения списка инспекторов', err);
            this.$store.commit('alert/ERROR', 'Ошибка получения списка инспекторов');
          })
          .finally(() => {
            this.fetching = false;
            this.selectedItems = [];
          })
    },

    onChangeInspector(id) {
      navigateTo(`/manager/inspectors/${id}/change`);
    },

    onRemoveSomeInspectors() {
      if (!this.selectedItems || this.selectedItems.length === 0) return;
      removeSomeInspectors(this.selectedItems)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Записи удалены');
            this.fetchInspectors();
          })
          .catch(err => {
            console.log('Ошибка удаления записей', err);
            this.$store.commit('alert/SUCCESS', 'Ошибка удаления записей');
          })
    },

    onRemoveInspector(id) {
      removeInspector(id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Инспектор успешно удален');
            this.fetchInspectors();
          })
          .catch(() => {
            this.$store.commit('alert/ERROR', 'Ошибка удаления инспектора');
          })
          .finally(() => {
            this.selectedItems = [];
          })
    },
  }
}
</script>