<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280" class="bg-transparent">

      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="navigateBack">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card variant="text">

        <v-card-title>{{ block?.address ?? '-' }}</v-card-title>

        <v-card-item>
          <div class="d-flex ga-8">
            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-weather-cloudy-clock"/>
              <div>
                <b>Начало:</b>
                <span class="ml-3">{{ dateFromTo }}</span>
              </div>
            </div>

            <div class="d-flex align-center ga-2">
              <v-icon icon="mdi-badge-account-outline"/>
              <div>
                <b>Инспектор:</b>
                <span class="ml-3">{{ inspector }}</span>
              </div>
            </div>
          </div>
        </v-card-item>

        <v-card-item/>

        <v-card-item>
          <v-sheet class="d-flex flex-column ga-4 bg-transparent">
            <v-sheet class="d-flex align-center ga-1 py-2 px-2 bg-lighten-5" border="sm" rounded="lg">
              <v-btn
                  prepend-icon="mdi-file-download-outline"
                  color="deep-purple"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="tonal"
                  size="small"
                  @click="downloadObjectsTemplate"
              >
                Скачать шаблон
                <v-tooltip activator="parent" location="top">
                  Скачать шаблон для заполнения объектами
                </v-tooltip>
              </v-btn>
              <v-btn
                  prepend-icon="mdi-table-arrow-up"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  @click="clickExcelInputFile"
              >
                Загрузить объекты
                <v-tooltip activator="parent" location="top">
                  Загрузить объекты из xlsx
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-file-document-arrow-right-outline"
                  append-icon="mdi-chevron-down"
                  color="blue-darken-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  :disabled="reportDownloading"
                  :loading="reportDownloading"
              >
                Скачать
                <v-tooltip activator="parent" location="top">
                  Скачать
                </v-tooltip>
                <v-menu activator="parent" transition="slide-y-reverse-transition">
                  <v-sheet class="mt-1 rounded-lg border-sm elevation-0">
                    <v-list-item
                        title="Скачать отчет"
                        density="compact"
                        @click="downloadReport"
                    >
                      <template #append>
                        <v-icon icon="mdi-text-box-outline" size="x-small"/>
                      </template>
                    </v-list-item>
                    <v-list-item
                        title="Скачать фотоматериалы"
                        density="compact"
                        :disabled="downloadingPhotos"
                        :loading="downloadingPhotos"
                        @click="downloadPhotos"
                    >
                      <template #append>
                        <v-icon icon="mdi-image" size="x-small"/>
                      </template>
                    </v-list-item>
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-btn
                  v-if="selectedItems.length > 0"
                  append-icon="mdi-chevron-down"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  border="sm"
                  variant="text"
                  size="small"
              >
                Операции
                <v-tooltip activator="parent">
                  Операции с выделенными объектами
                </v-tooltip>
                <v-menu activator="parent" transition="slide-y-reverse-transition">
                  <v-sheet class="mt-1 rounded-lg elevation-0 border-sm">
                    <v-list-item density="compact" title="Удалить объекты" @click=""/>
                    <v-list-item
                        append-icon="mdi-menu-right"
                        title="Изменить тип объектов"
                        density="compact"
                    >
                      <v-menu :open-on-focus="false" activator="parent" open-on-hover submenu>
                        <v-sheet
                            max-height="250"
                            min-width="250"
                            class="border-sm rounded-lg bg-white mr-1"
                            transition="slide-y-reverse-transition"
                        >
                          <v-sheet class="pr-2 py-2">
                            <v-text-field v-model="searchTypes" v-bind="mySearchFieldStyle" @click.stop/>
                          </v-sheet>
                          <v-divider/>
                          <div v-if="itemsObjectTypes.length === 0" class="text-center py-2">Пусто</div>
                          <v-list-item
                              v-for="type of itemsObjectTypes"
                              :title="type"
                              class=" text-caption"
                              density="compact"
                              @click="onChangeTypeSelectedObjects"
                          />
                        </v-sheet>
                      </v-menu>
                    </v-list-item>
                  </v-sheet>
                </v-menu>
              </v-btn>
              <v-spacer/>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-table-large-remove"
                  color="red-darken-4"
                  class="text-caption"
                  density="comfortable"
                  rounded="middle"
                  variant="text"
                  size="small"
                  @click="removeAllQuestionVisible = true"
              >
                Удалить все
                <v-tooltip activator="parent" location="top">
                  Удалить все объекты
                </v-tooltip>
              </v-btn>
            </v-sheet>

            <v-sheet v-bind="myTableSheetStyle">
              <v-sheet class="d-flex align-center mb-6">
                <b>Объекты осмотра</b>
                <v-spacer/>
                <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
                <!--              <v-btn icon="mdi-filter-cog-outline" size="small" variant="plain" rounded="lg">-->
                <!--                <v-icon/>-->
                <!--                <v-menu v-model="filterMenuVisible" activator="parent" :close-on-content-click="false"-->
                <!--                        location="start">-->
                <!--                  <v-card min-width="250">-->
                <!--                    <v-card-item>-->
                <!--                      <div class="px-2">-->
                <!--                        <v-switch-->
                <!--                            v-model="filter.objectIsMissing"-->
                <!--                            color="blue-darken-3"-->
                <!--                            label="Отсутствующие"-->
                <!--                            density="compact"-->
                <!--                            hide-details-->
                <!--                        />-->
                <!--                        <v-switch-->
                <!--                            v-model="filter.objectWithDefect"-->
                <!--                            color="blue-darken-3"-->
                <!--                            label="С дефектами"-->
                <!--                            density="compact"-->
                <!--                            hide-details-->
                <!--                        />-->
                <!--                      </div>-->
                <!--                    </v-card-item>-->
                <!--                  </v-card>-->
                <!--                </v-menu>-->
                <!--              </v-btn>-->
              </v-sheet>
              <v-data-table
                  v-model="selectedItems"
                  v-model:items-per-page="itemsPerPage"
                  :items-per-page-options="itemsPerPageOptions"
                  :items-per-page="itemsPerPage"
                  :search="searchText"
                  :loading="fetching"
                  :headers="headers"
                  :items="itemsMap"
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
                <template #item.objectType="{ item }">
                  <v-chip
                      append-icon="mdi-menu-down"
                      class="cursor-pointer"
                      density="compact"
                      border="thin"
                      size="small"
                      color="teal"
                      label
                  >
                    {{ item.objectType }}
                    <v-tooltip>Выбрать тип</v-tooltip>
                    <v-menu activator="parent" location="left top">
                      <v-sheet
                          max-height="250"
                          min-width="250"
                          class="border-sm rounded-lg bg-white mr-1"
                          transition="slide-y-reverse-transition"
                      >
                        <v-sheet class="pr-2 py-2">
                          <v-text-field v-model="searchTypes" v-bind="mySearchFieldStyle" @click.stop/>
                        </v-sheet>
                        <v-divider/>
                        <div v-if="itemsObjectTypes.length === 0" class="text-center py-2">Пусто</div>
                        <v-list-item
                            v-for="type of itemsObjectTypes"
                            :title="type"
                            class=" text-caption"
                            density="compact"
                            @click=""
                        />
                      </v-sheet>
                    </v-menu>
                  </v-chip>
                </template>
                <template #item.actions="{ item }">
                  <v-btn
                      icon="mdi-open-in-new"
                      density="comfortable"
                      color="deep-orange"
                      variant="text"
                      size="small"
                      @click.stop="onOpenObjectCard(item._id)"
                  >
                    <v-icon/>
                    <v-tooltip activator="parent" location="left">
                      Открыть карточку
                    </v-tooltip>
                  </v-btn>
                  <my-change-button
                      class="ml-2"
                      prompt="Редактировать объект"
                      @click.stop="onObjectChange(item._id)"
                  />
                </template>
              </v-data-table>
            </v-sheet>
          </v-sheet>
        </v-card-item>
      </v-card>

      <my-overlay v-model="removeAllQuestionVisible">
        <v-sheet class="px-4 py-1 bg-white rounded-lg">
          <v-card-item>
            Очистить таблицу ?
          </v-card-item>
          <v-card-subtitle>
            удалить все объекты и фотографии
          </v-card-subtitle>
          <v-card-item>
            <v-divider/>
          </v-card-item>
          <v-card-actions>
            <v-btn
                @click.stop="removeObjectsAll"
                variant="flat"
                density="comfortable"
                class="border-sm rounded-lg"
                text="Да"
            />
            <v-btn
                @click.stop="removeAllQuestionVisible=false"
                density="comfortable"
                class="rounded-lg"
                text="Отмена"
            />
          </v-card-actions>
        </v-sheet>
      </my-overlay>
    </v-sheet>

    <v-file-input class="d-none" ref="excelFileInput" accept=".xlsx" @change="onExcelFileInput"/>
  </v-container>
</template>

<script>
import {
  fetchAssignmentBlockOneById,
  uploadObjects,
  downloadPhotos
} from "../../../../../utils/api/api_assignment_blocks";
import {
  myBtnPlus,
  mySearchFieldStyle,
  myTableSheetStyle,
  navigateBackBtnStyle,
} from "../../../../../configs/styles";
import {fetchInspectionObjects, removeObjects} from "../../../../../utils/api/api_inspection_objects";
import {unixDateToMiddleDateString} from "../../../../../utils/functions";
import {serverURL} from "../../../../../constants/constants";
import {downloadFile} from "../../../../../utils/api/api_";
import {navigateTo} from "nuxt/app";

export default {
  name: "block-page",

  data() {
    return {
      headers: [
        {
          title: '№ п/п',
          align: 'start',
          key: 'number',
          value: 'number',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Наименование',
          align: 'start',
          key: 'name',
          value: 'name',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Инв. №',
          align: 'start',
          key: 'inventoryNumber',
          value: 'inventoryNumber',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Наличие объекта',
          align: 'end',
          key: 'isExist',
          value: 'isExist',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Наличие дефекта',
          align: 'end',
          key: 'isDefect',
          value: 'isDefect',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Тип объекта',
          align: 'end',
          key: 'objectType',
          value: 'objectType',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Описание дефекта',
          align: 'end',
          key: 'defectDescription',
          value: 'defectDescription',
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
      items: [],
      selectedItems: [],
      fetching: false,
      block: null,
      searchText: '',
      searchTypes: '',
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      // IMPORT STYLES
      navigateBackBtnStyle,
      mySearchFieldStyle,
      myTableSheetStyle,
      myBtnPlus,

      loading: false,
      reportDownloading: false,
      filterMenuVisible: false,
      downloadingPhotos: false,
      removeAllQuestionVisible: false,
      filter: {
        objectIsMissing: null,
        objectWithDefect: null,
      },

    }
  },

  async beforeMount() {
    fetchAssignmentBlockOneById(useRoute().params.blockId)
        .then(response => {
          this.block = response.data ?? null;
          this.fetchInspectionObjects();
        })
        .catch(err => {
          console.log('Ошибка, такого адреса не существует');
          this.$store.commit('alert/ERROR', 'Такого адреса не существует');
          this.navigateBack();
        })
  },

  computed: {

    itemsMap() {
      return this.itemsSearchFilter.map((e, i) => ({
        _id: e._id,
        number: i + 1,
        name: e?.name, //  ? this.textSlicer(e?.name, 100) : '-',
        inventoryNumber: e?.inventoryNumber ? this.textSlicer(e?.inventoryNumber, 25) : '-',
        isExist: e.isExist === null ? '-' : e.isExist === true ? 'Да' : 'Нет',
        isDefect: e.isDefect === null ? '-' : e.isDefect === true ? 'Да' : 'Нет',
        objectType: e.objectType ?? '-',
        defectDescription: e.description ? this.textSlicer(e.description, 20) : '-',
      }))
    },

    itemsSearchFilter() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        const exp = new RegExp(this.searchText, "ig")
        return this.items.filter(object => {
          return [
            object?.address,
            object?.description,
            object?.objectType,
            object?.name,
            object?.model,
            object?.serialNumber,
            object?.status,
            object?.inventoryNumber
          ].filter(e => !!e).find(value => exp.test(value));
        })
      } else {
        return this.items;
      }
    },

    itemsObjectTypes() {
      return this.itemsObjectTypes2
          .concat(this.itemsObjectTypes2)
          .concat(this.itemsObjectTypes2)
          .concat(this.itemsObjectTypes2)
          .concat(this.itemsObjectTypes2)
          .concat(this.itemsObjectTypes2)
    },

    itemsObjectTypes2() {
      const ex = new RegExp(this.searchTypes, 'ig')
      return this.items.map(e => e.objectType)?.filter(e => {
        return !!e && ex.test(e);
      })
    },

    dateFromTo() {
      return unixDateToMiddleDateString(this.block?.startDate);
    },

    inspector() {
      if (!this.block?.inspector?.firstName
          && !this.block?.inspector?.lastName
          && !this.block?.inspector?.phoneNumber
      ) return '[Не указан]'

      return this.block?.inspector?.firstName +
          (this.block?.inspector?.lastName ? ` ${this.block?.inspector?.lastName}` : '') +
          (this.block?.inspector?.phoneNumber ? `, ${this.block?.inspector?.phoneNumber}` : '')
    }

  },

  methods: {

    async downloadPhotos() {
      this.downloadingPhotos = true;
      await downloadPhotos(this.block._id);
      this.downloadingPhotos = false;
    },

    getColorByStatus(inspectionObject) {
      if (!inspectionObject.isExist) return 'bg-pink-lighten-5';
      if (inspectionObject.isDefect) return 'bg-amber-lighten-4';
      return '';
    },

    onChangeTypeSelectedObjects() {
      console.log('[function] onChangeTypeSelectedObjects');
      // TODO: Добавить логику изменения типов объектов для выделенных объектов
    },

    clickExcelInputFile() {
      this.$refs.excelFileInput.click();
    },

    downloadObjectsTemplate() {
      downloadFile('objects template.xlsx', serverURL + '/inspection-objects/inspectionObjectTemplates');
    },

    downloadReport() {
      this.reportDownloading = true;
      const assignmentBlockId = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']?._id;
      downloadFile('Отчет.docx', `${serverURL}/reports/${assignmentBlockId}/commercial-proposal`)
          .catch(err => {
            console.log('Ошибка загрузки отчета', err);
          })
          .finally(() => {
            this.reportDownloading = false;
          })
    },

    onExcelFileInput(event) {
      if (event.target.files && event.target.files.length > 0) {
        const formData = new FormData();
        formData.append('excelObjects', event.target.files[0]);
        uploadObjects(this.block._id, formData)
            .then(() => {
              this.$refs.excelFileInput.value = '';
              this.fetchInspectionObjects();
            })
            .catch(err => {
              this.$store.commit('alert/ERROR', 'Не удалось загрузить файл');
              console.log('Не удалось загрузить файл', err);
            })
      }
    },

    fetchInspectionObjects() {
      fetchInspectionObjects(useRoute().params.blockId)
          .then(response => {
            this.items = response.data ?? [];
          })
          .catch(err => {
            console.log('Ошибка получения списка объектов', err)
          })
    },

    navigateBack() {
      // if (window.history.length <= 2) {
      navigateTo(`/manager/assignments/${useRoute().params.assignmentId}/`);
      // } else {
      //   this.$router.back();
      // }
    },

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    onOpenObjectCard(id) {
      navigateTo(`${id}/`);
    },

    onObjectChange(id) {
      navigateTo(`${id}/change`);
    },

    removeObjectsAll() {
      removeObjects(this.block._id)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Объекты успешно удалены');
            this.fetchInspectionObjects();
          })
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось удалить объекты');
            console.log('Ошибка удаления объектов', err);
          })
    }
  }
}
</script>

<style>
.small-font td {
  font-size: 12px; /* Уменьшение шрифта */
}
</style>
