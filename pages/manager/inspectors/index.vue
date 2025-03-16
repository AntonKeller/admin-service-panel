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
              @click="onAddNewInspector"
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
              :disabled="!selectedInspectors.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item
                    append-icon="mdi-format-list-checks"
                    density="compact"
                    @click="selectedInspectors=[]"
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
              v-if="inspectorSearching"
              color="grey"
              size="25"
              indeterminate
          />

          <v-text-field
              v-model="_inspectorSearchTxt"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
          />
        </div>
      </v-sheet>

      <v-data-table
          v-model="selectedInspectors"
          v-model:items-per-page="itemsPerPage"
          :items-per-page-options="itemsPerPageOptions"
          :items-per-page="itemsPerPage"
          :items="itemsSearchFilter"
          :search="inspectorSearchTxt"
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
          @update:current-items="selectedInspectors = []"
      >
        <template #item.name="{ item }">
          {{ getFullName(item) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <my-change-button prompt="Редактировать ТЗ" @click.stop="onChangeInspector(item._id)"/>
          <my-button-table-remove :prompt="'Удалить'" @click:yes="onRemoveInspector(item._id)" class="ml-2"/>
        </template>
        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedInspectors.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selectedInspectors.length }}
          </div>
        </template>
      </v-data-table>

    </v-sheet>
  </v-container>
</template>

<script setup>
import {addInspector, fetchInspectors, removeInspector, removeSomeInspectors} from "@/utils/api/api_inspectors";
import useTableOptions from "@/composables/useTableOptions";
import headers from "@/configs/inspectorsTableHeaders";
import {mySearchFieldStyle} from "@/configs/styles";
import useSearch from "@/composables/useSearch";
import {useStore} from "vuex";
import {ref} from 'vue';

const {
  itemsPerPage,
  itemsPerPageOptions,
} = useTableOptions();

const {
  _search: _inspectorSearchTxt,
  search: inspectorSearchTxt,
  searching: inspectorSearching,
  searchIsNotEmpty,
} = useSearch();

const store = useStore();
const inspectors = ref([]);
const fetching = ref(false);
const selectedInspectors = ref([]);

onBeforeMount(() => {
  fetchInspectorsCollection();
});

const itemsSearchFilter = computed(() => {
  if (!searchIsNotEmpty) return inspectors.value;
  const ex = new RegExp(inspectorSearchTxt.value, 'ig');
  return inspectors.value.filter(e => {
    return ex.test([
      e?.firstName ?? null,
      e?.surname ?? null,
      e?.lastName ?? null,
      e?.phoneNumber ?? null,
      e?.email ?? null
    ].filter(e => !!e).join(' '));
  })
});

const fetchInspectorsCollection = () => {
  fetching.value = true;
  fetchInspectors()
      .then(response => {
        inspectors.value = response.data;
      })
      .catch(err => {
        console.log('Ошибка получения списка инспекторов', err);
        store.commit('alert/ERROR', 'Ошибка получения списка инспекторов');
      })
      .finally(() => {
        fetching.value = false;
        selectedInspectors.value = [];
      })
}

const getFullName = (user) => {
  return `${user?.surname ?? ''} ${user?.firstName ?? ''} ${user?.lastName ?? ''}`;
}

const onAddNewInspector = () => {
  addInspector({
    _id: null,
    firstName: null,
    surname: null,
    lastName: null,
    phoneNumber: null,
    email: null,
    login: null,
    password: null,
  }).then(() => {
    fetchInspectorsCollection();
    store.commit('alert/SUCCESS', 'Добавлен новый инспектор');
  }).catch((err) => {
    console.log('Ошибка добавление инспектора', err);
    store.commit('alert/ERROR', 'Ошибка добавление инспектора');
  }).finally(() => {
    selectedInspectors.value = [];
  })
}

const onChangeInspector = (id) => {
  navigateTo(`/manager/inspectors/${id}/change`);
}

const updateTable = () => {
  fetching.value = true;
  const timeoutId = setTimeout(() => {
    fetchInspectorsCollection();
    clearTimeout(timeoutId);
  }, 500)
}

const onRemoveInspector = (id) => {
  removeInspector(id)
      .then(() => {
        store.commit('alert/SUCCESS', 'Инспектор успешно удален');
        fetchInspectorsCollection();
      })
      .catch(() => {
        store.commit('alert/ERROR', 'Ошибка удаления инспектора');
      })
      .finally(() => {
        selectedInspectors.value = [];
      })
}

const onRemoveSomeInspectors = () => {
  if (!selectedInspectors.value || selectedInspectors.value.length === 0) return;
  removeSomeInspectors(selectedInspectors.value)
      .then(() => {
        fetchInspectorsCollection();
        store.commit('alert/SUCCESS', 'Записи удалены');
      })
      .catch(err => {
        console.log('Ошибка удаления записей', err);
        store.commit('alert/SUCCESS', 'Ошибка удаления записей');
      })
}
</script>