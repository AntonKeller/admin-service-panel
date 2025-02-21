<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1280">

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

        <v-card-subtitle>
          <div class="d-flex flex-column ga-2">
            <div class="d-flex ga-2">
              <b>Начало:</b>{{ dateFromTo }}
            </div>
          </div>
        </v-card-subtitle>

        <v-card-item class="text-caption">
          <div class="d-flex flex-column ga-2 py-1">
            <v-btn-group variant="text" color="blue-darken-4" density="compact">
              <v-btn
                  prepend-icon="mdi-file-download-outline"
                  color="blue-grey-darken-2"
                  size="small"
                  @click="downloadObjectsTemplate"
              >
                Скачать шаблон
                <v-tooltip activator="parent" location="top">
                  Скачать шаблон для заполнения объектами
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-table-arrow-up"
                  color="blue-grey-darken-2"
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
                  color="blue-darken-2"
                  size="small"
                  :disabled="reportDownloading"
                  :loading="reportDownloading"
                  @click="downloadReport"
              >
                Скачать отчет
                <v-tooltip activator="parent" location="top">
                  Скачать отчет
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-folder-download-outline"
                  color="blue-darken-2"
                  size="small"
                  :disabled="downloadingPhotos"
                  :loading="downloadingPhotos"
                  @click="downloadPhotos"
              >
                Скачать фотоматериалы
                <v-tooltip activator="parent" location="top">
                  Скачать фотоматериалы
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-table-large-remove"
                  color="red-darken-2"
                  size="small"
                  @click="removeAllQuestionIsVisible = true"
              >
                Удалить все
                <v-tooltip activator="parent" location="top">
                  Удалить все объекты
                </v-tooltip>
              </v-btn>
            </v-btn-group>

            <v-row no-gutters>
              <v-col :cols="8">
                <v-text-field v-model="searchText" v-bind="mySearchFieldStyle"/>
              </v-col>
              <v-col :cols="2">
                <v-btn icon="mdi-filter-cog-outline" size="small" variant="plain" rounded="sm">
                  <v-icon/>
                  <v-menu v-model="filterMenuVisible" activator="parent" :close-on-content-click="false"
                          location="start">
                    <v-card min-width="250">
                      <v-card-item>
                        <div class="px-2">
                          <v-switch
                              v-model="filter.objectIsMissing"
                              color="blue-darken-3"
                              label="Отсутствующие"
                              density="compact"
                              hide-details
                          />
                          <v-switch
                              v-model="filter.objectWithDefect"
                              color="blue-darken-3"
                              label="С дефектами"
                              density="compact"
                              hide-details
                          />
                        </div>
                      </v-card-item>
                    </v-card>
                  </v-menu>
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-card-item>

        <v-card-item>
          <v-sheet class="border-sm rounded-lg bg-white px-7 pt-5 pb-2">
            <v-data-table
                v-model="selectedItems"
                v-model:items-per-page="itemsPerPage"
                :items-per-page-options="itemsPerPageOptions"
                :items-per-page="itemsPerPage"
                :search="searchText"
                :loading="fetching"
                :headers="headers"
                :items="itemsMap"
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
                @update:current-items="selectedItems = []"
            >
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
                    prompt="Редактировать ТЗ"
                    @click.stop="onObjectChange(item._id)"
                />
                <my-button-table-remove
                    :prompt="'Удалить'"
                    class="ml-2"
                    @click:yes="onRemoveObject(item._id)"
                />
              </template>
            </v-data-table>
          </v-sheet>
        </v-card-item>


        <!--        <v-card-item>-->
        <!--          <v-table style="max-height: 60vh" density="compact" fixed-header class="text-caption elevation-0">-->
        <!--            <thead>-->
        <!--            <tr class="text-blue-darken-4">-->
        <!--              <th class="text-left">№ п/п</th>-->
        <!--              <th class="text-left">Наименование</th>-->
        <!--              <th class="text-left">Инв. №</th>-->
        <!--              <th class="text-left">Наличие объекта</th>-->
        <!--              <th class="text-left">Наличие дефекта</th>-->
        <!--              <th class="text-left">Описание дефекта</th>-->
        <!--            </tr>-->
        <!--            </thead>-->
        <!--            <tbody>-->
        <!--            <tr-->
        <!--                v-for="(inspectionObject, i) in objectsSlice"-->
        <!--                :key="inspectionObject._id"-->
        <!--                :class="getColorByStatus(inspectionObject)"-->
        <!--                class="row-hover"-->
        <!--                @click.stop="navigateToObject(inspectionObject)"-->
        <!--            >-->
        <!--              <td style="min-width: 100px; width: 100px; max-width: 100px">{{ i + 1 }}</td>-->
        <!--              <td style="min-width: 260px; width: 260px; max-width: 260px">-->
        <!--                {{ textSlicer(inspectionObject?.name, 100) || '-' }}-->
        <!--              </td>-->
        <!--              <td style="min-width: 120px; width: 120px; max-width: 120px">-->
        <!--                {{ textSlicer(inspectionObject?.inventoryNumber, 25) || '-' }}-->
        <!--              </td>-->
        <!--              <td style="min-width: 80px; width: 80px; max-width: 80px">-->
        <!--                {{ inspectionObject.isExist ? 'Да' : 'Нет' }}-->
        <!--              </td>-->
        <!--              <td style="min-width: 80px; width: 80px; max-width: 80px">-->
        <!--                {{ inspectionObject.isDefect ? 'Да' : 'Нет' }}-->
        <!--              </td>-->
        <!--              <td>-->
        <!--                {{ textSlicer(inspectionObject.description, 20) || '-' }}-->
        <!--              </td>-->
        <!--            </tr>-->
        <!--            </tbody>-->
        <!--          </v-table>-->
        <!--        </v-card-item>-->
      </v-card>

      <!--      <my-overlay v-model="removeAllQuestionIsVisible">-->
      <!--        <v-card color="red-darken-4" rounded="sm">-->
      <!--          <v-card-text>-->
      <!--            <v-icon>mdi-progress-question</v-icon>-->
      <!--            <span class="ml-2">Хотите удалить все объекты?</span>-->
      <!--          </v-card-text>-->
      <!--          <v-card-actions>-->
      <!--            <v-btn @click.stop="removeObjectsAll" variant="elevated" text="Да"/>-->
      <!--            <v-btn @click.stop="removeAllQuestionIsVisible=false" text="Отмена"/>-->
      <!--          </v-card-actions>-->
      <!--        </v-card>-->
      <!--      </my-overlay>-->

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
import {myBtnPlus, mySearchFieldStyle, navigateBackBtnStyle} from "../../../../../configs/styles";
import {fetchInspectionObjects, removeObjects} from "../../../../../utils/api/api_inspection_objects";
import {unixDateToMiddleDateString} from "../../../../../utils/functions";
import {serverURL} from "../../../../../constants/constants";
import {downloadFile} from "../../../../../utils/api/api_";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

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
          align: 'name',
          key: 'name',
          value: 'start',
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
          align: 'start',
          key: 'isExist',
          value: 'isExist',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Наличие дефекта',
          align: 'start',
          key: 'isDefect',
          value: 'isDefect',
          sortable: true,
          nowrap: false,
          _$visible: true,
        },
        {
          title: 'Описание дефекта',
          align: 'start',
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
      itemsPerPage: 10,
      itemsPerPageOptions: [
        {value: 10, title: '10'},
        {value: 25, title: '25'},
        {value: 50, title: '50'},
      ],

      // IMPORT STYLES
      navigateBackBtnStyle,
      mySearchFieldStyle,
      myBtnPlus,

      visibility: false,
      currentPage: 1,
      loading: false,
      reportDownloading: false,
      blockMenuChangeVisibility: false,
      filterMenuVisible: false,
      downloadingPhotos: false,
      removeAllQuestionIsVisible: false,
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
          console.log('Ошибка получения списка объектов');
          // this.$store.commit('alert/ERROR', 'Ошибка получения списка объектов');
        })
  },

  computed: {

    itemsMap() {
      return this.itemsSearchFilter.map((e, i) => ({
        _id: e._id,
        number: i + 1,
        name: e?.name ? this.textSlicer(e?.name, 100) : '-',
        inventoryNumber: e?.inventoryNumber ? this.textSlicer(e?.inventoryNumber, 25) : '-',
        isExist: e.isExist === null ? '-' : e.isExist === true ? 'Да' : 'Нет',
        isDefect: e.isDefect === null ? '-' : e.isDefect === true ? 'Да' : 'Нет',
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

    dateFromTo() {
      return unixDateToMiddleDateString(this.block?.startDate);
    },

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

      console.log('event.target.files:', event.target.files)

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
      if (window.history.length <= 1) {
        const p = useRoute().params;
        navigateTo(`/manager/assignments/${p.assignmentId}/${p.blockId}/`);
      } else {
        this.$router.back();
      }
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
    onRemoveObject(id) {

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
