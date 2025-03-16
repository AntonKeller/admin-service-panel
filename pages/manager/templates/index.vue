<template>
  <v-container fluid class="bg-white">
    <v-sheet max-width="1280" class="bg-transparent">

      <v-sheet class="border-b bg-white pb-3">
        <v-card-title class="">Шаблоны объектов осмотра</v-card-title>
        <v-card-subtitle class="d-flex align-center ga-2">
          <v-icon icon="mdi-layers-triple-outline" size="small"/>
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
              @click="createNewTemplate"
          >
            Добавить шаблон
            <v-tooltip activator="parent" text="Добавить новую запись"/>
          </v-btn>

          <div class="mx-3"></div>

          <v-btn
              append-icon="mdi-chevron-down"
              variant="text"
              size="small"
              rounded="md"
              border
              :disabled="!selectedTemplates.length"
          >
            Операции
            <v-tooltip activator="parent" text="Операции с выделенными"/>
            <v-menu activator="parent" transition="scale-transition">
              <v-sheet rounded="md" class="mt-1" elevation="0" border>
                <v-list-item append-icon="mdi-format-list-checks" density="compact" @click="selectedTemplates=[]">
                  <template #append>
                    <v-icon icon="mdi-format-list-checks" size="small"/>
                  </template>
                  <v-list-item-title>Снять выделение</v-list-item-title>
                </v-list-item>
                <v-divider/>
                <v-list-item append-icon="mdi-delete-sweep-outline" density="compact" @click="onRemoveSomeTemplates">
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
              @click="fetchTemplatesCollection"
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
              v-model="_search"
              v-bind="mySearchFieldStyle"
              style="max-width: 350px"
          />
        </div>
      </v-sheet>
      <v-data-table
          v-model="selectedTemplates"
          v-model:items-per-page="templatesItemsPerPage"
          :items-per-page-options="templatesItemsPerPageOptions"
          :items-per-page="templatesItemsPerPage"
          :items="templatesMap"
          :headers="templatesTableHeaders"
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
          @update:current-items="selectedTemplates = []"
      >
        <template #item.actions="{ item }">
          <v-btn
              icon="mdi-open-in-new"
              density="comfortable"
              variant="text"
              size="small"
              @click.stop="showObjectTypes(item._id)"
          >
            <v-icon/>
            <v-tooltip activator="parent" location="left">
              Открыть шаблон шаблон
            </v-tooltip>
          </v-btn>
          <my-change-button
              class="ml-2"
              prompt="Редактировать шаблон"
              @click.stop="onShowChangeMenuTemplate(item._id)"
          />
          <my-button-table-remove
              :prompt="'Удалить'"
              class="ml-2"
              @click:yes="onRemoveTemplate(item._id)"
          />
        </template>

        <template #footer.prepend>
          <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedTemplates.length">
            <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
            Выбрано элементов: {{ selectedTemplates.length }}
          </div>
        </template>
      </v-data-table>

      <v-overlay v-model="objectTypesOverlay" class="d-flex justify-center align-center">
        <v-sheet class="d-flex flex-column ga-4 px-7 py-4 h-100 rounded-lg" width="800">
          <v-chip text="Типы объектов" color="blue-darken-1" variant="flat" label/>
          <div class="d-flex ga-1">
            <v-btn
                prepend-icon="mdi-tray-arrow-down"
                color="blue-accent-4"
                variant="text"
                size="small"
                rounded="md"
                border
                @click="onDownloadTemplate"
            >
              Скачать шаблон
              <v-tooltip activator="parent" text="Скачать шаблон"/>
            </v-btn>
            <v-btn
                prepend-icon="mdi-tray-arrow-up"
                color="blue-accent-4"
                variant="text"
                size="small"
                rounded="md"
                border
                @click="$refs.excelFileInput.click()"
            >
              Загрузить типы
              <v-tooltip activator="parent" text="Загрузить шаблон"/>
            </v-btn>
            <v-btn
                :loading="fetching"
                prepend-icon="mdi-update"
                variant="text"
                size="small"
                rounded="md"
                border
                @click="fetchTemplatesCollection"
            >
              Обновить
              <v-tooltip activator="parent" text="Обновить данные"/>
            </v-btn>
          </div>
          <div>
            <v-data-table
                v-model="selectedObjectTypes"
                v-model:items-per-page="objectTypesItemsPerPage"
                :items-per-page-options="objectTypesItemsPerPageOptions"
                :items-per-page="objectTypesItemsPerPage"
                :items="objectTypesMap"
                :headers="objectTypesHeaders"
                style="max-height: 300px"
                items-per-page-text="Кол-во на странице"
                loading-text="Загрузка данных..."
                no-data-text="Нет данных"
                class="bg-transparent"
                density="comfortable"
                items-per-page="5"
                item-value="_id"
                fixed-header
                show-select
                @update:current-items="selectedTemplates = []"
            >
              <template #item.actions="{ item }">
                <my-change-button
                    class="ml-2"
                    prompt="Редактировать"
                    @click.stop=""
                />
                <my-button-table-remove
                    :prompt="'Удалить'"
                    class="ml-2"
                    @click:yes="onRemoveTemplate(item._id)"
                />
              </template>

              <template #footer.prepend>
                <div class="mr-auto text-grey-darken-1 pl-4 mt-2" v-if="selectedTemplates.length">
                  <v-icon icon="mdi-order-bool-ascending-variant" class="mr-1"/>
                  Выбрано элементов: {{ selectedTemplates.length }}
                </div>
              </template>
            </v-data-table>
          </div>
        </v-sheet>
      </v-overlay>

      <v-overlay v-model="changeTemplateOverlay" class="d-flex justify-center align-center">
        <v-sheet rounded="lg" width="600px">
          <v-card-item>Редактирование заголовка</v-card-item>
          <v-card-item>
            <v-form v-model="changeTemplateFormIsValid" ref="changeTemplateForm" class="d-flex flex-column mt-2">
              <v-row dense>
                <v-col :cols="12">
                  <v-text-field
                      v-model="selectedTemplate.title"
                      v-bind="inputFieldStyle"
                      label="Заголовок"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-card-item>
          <v-card-actions>
            <my-btn-submit
                text="Принять"
                prepend-icon="mdi-checkbox-multiple-marked-outline"
                @click="onChangeTemplate"
            />
          </v-card-actions>
        </v-sheet>
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

<script setup>
import {
  changeTemplate,
  downloadExcelTemplate,
  removeSomeTemplates,
  removeTemplate,
  uploadExcelTemplate
} from "@/utils/api/templates";
import {mySearchFieldStyle, inputFieldStyle} from "@/configs/styles";
import templatesTableHeaders from "@/configs/templatesTableHeaders";
import objectTypesHeaders from "@/configs/objectTypesHeaders";
import useTableOptions from "@/composables/useTableOptions";
import useTemplates from "@/composables/useTemplates";
import useSearch from "@/composables/useSearch";
import {ref, watch} from 'vue';
import {useStore} from 'vuex';
import _ from "lodash";

const {
  _search,
  search,
  searching
} = useSearch();

const {
  fetching,
  createNewTemplate,
  templatesCollection,
  fetchTemplatesCollection
} = useTemplates();

const {
  itemsPerPage: templatesItemsPerPage,
  itemsPerPageOptions: templatesItemsPerPageOptions
} = useTableOptions();

const {
  itemsPerPage: objectTypesItemsPerPage,
  itemsPerPageOptions: objectTypesItemsPerPageOptions
} = useTableOptions();

const store = useStore();
const selectedTemplate = ref(null);
const selectedTemplateId = ref(null);
const selectedTemplates = ref([]);
const selectedObjectTypes = ref([]);
const objectTypesOverlay = ref(false);
const changeTemplateFormIsValid = ref(false);
const changeTemplateOverlay = ref(false);

onBeforeMount(() => {
  fetchTemplatesCollection()
      .then(() => {
        console.log(templatesCollection.value, search.value)
      })
});

watch(selectedTemplateId, () => {
  selectedTemplate.value = _.cloneDeep(templatesCollection.value.find(e => e._id === selectedTemplateId.value));
})

const objectTypesMap = computed(() => {
  return templatesCollection.value
      ?.find(e => e._id === selectedTemplateId.value)
      ?.objectTypes?.map(e => ({
        _id: e._id,
        type: e.type,
        anglesCount: e.angles?.length ?? 0,
      })) ?? [];
});


const templatesMap = computed(() => {
  return templatesSearchFilter.value.map(e => ({
    _id: e._id,
    title: e?.title || '-',
    objectTypesLen: e.objectTypes?.length ?? 0,
    isBase: e?.isBase === true ? 'Да' : e?.isBase === false ? 'Нет' : '-',
  }));
});


const templatesSearchFilter = computed(() => {
  if (!search.value) return templatesCollection.value;
  const reg = new RegExp(search.value, 'ig');
  return templatesCollection.value.filter(e => {
    return reg.test(e.title);
  });
});


const showObjectTypes = (templateId) => {
  selectedTemplateId.value = templateId;
  objectTypesOverlay.value = true;
}


const onDownloadTemplate = () => {
  downloadExcelTemplate('template.xlsx')
      .catch(err => {
        console.log('Ошибка загрузки', err);
        store.commit('alert/ERROR', 'Ошибка загрузки');
      })
}

const onChangeTemplate = () => {
  changeTemplate(selectedTemplate.value)
      .then(() => {
        store.commit('alert/SUCCESS', 'Заголовок изменен');
        changeTemplateOverlay.value = false;
        fetchTemplatesCollection();
      })
      .catch(err => {
        console.log('Ошибка изменения', err);
        store.commit('alert/ERROR', 'Ошибка изменения');
      })
}

const onUploadTemplate = (event) => {
  console.log('selectedTemplateId.value', selectedTemplateId.value)
  if (event.target.files && event.target.files.length > 0 && selectedTemplateId.value) {
    uploadExcelTemplate(selectedTemplateId.value, event.target.files[0])
        .then(() => {
          fetchTemplatesCollection();
          store.commit('alert/SUCCESS', 'Добавлен новый шаблон');
        })
        .catch(err => {
          console.log('Ошибка добавления нового шаблона', err);
          store.commit('alert/ERROR', 'Ошибка добавления нового шаблона');
        })
  }
}

const onRemoveTemplate = (id) => {
  removeTemplate(id)
      .then(() => {
        fetchTemplatesCollection();
        store.commit('alert/SUCCESS', 'Запись удалена');
      })
      .catch((err) => {
        console.log('Ошибка удаления записи', err);
        store.commit('alert/ERROR', 'Ошибка удаления записи');
      })
}

const onShowChangeMenuTemplate = (templateId) => {
  selectedTemplateId.value = templateId;
  changeTemplateOverlay.value = true;
}

const onRemoveSomeTemplates = () => {
  if (selectedTemplates.value.length === 0) store.commit('alert/ERROR', 'Не выбраны шаблоны');

  removeSomeTemplates(selectedTemplates.value)
      .then(() => {
        store.commit('alert/SUCCESS', 'Успешно удалены');
        fetchTemplatesCollection();
      })
      .catch(err => {
        store.commit('alert/ERROR', 'Ошибка удаления');
      })
}
</script>