<template>
  <v-container fluid>
    <v-sheet min-width="400" max-width="1024">
      <v-card variant="text">
        <v-card-title>
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex ga-1 align-center">
              {{ selectedAssignmentBlock.address }}
            </div>
            <v-btn
                density="comfortable"
                color="blue-grey-darken-2"
                icon="mdi-arrow-left"
                variant="text"
                rounded="lg"
                @click="navigateBack"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Назад
              </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-subtitle>
          <div class="d-flex flex-column ga-2">
            <div class="d-flex ga-2">
              <b>Начало:</b>{{ dateFromTo }}
            </div>
          </div>
        </v-card-subtitle>

        <v-card-text class="text-caption">
          <div class="d-flex flex-column ga-1  py-1">
            <v-btn-group variant="text" color="blue-darken-4" density="compact">
              <v-btn
                  color="blue-grey-darken-2"
                  size="small"
                  prepend-icon="mdi-file-download-outline"
                  @click="downloadObjectsTemplate"
              >
                Скачать шаблон
                <v-tooltip activator="parent" location="top">
                  Скачать шаблон для заполнения объектами
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  color="blue-grey-darken-2"
                  prepend-icon="mdi-table-arrow-up"
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
                  prepend-icon="mdi-file-document-arrow-right-outline"
                  color="red-darken-2"
                  size="small"
                  @click="removeObjectsAll"
              >
                Удалить все
                <v-tooltip activator="parent" location="top">
                  Удалить все объекты
                </v-tooltip>
              </v-btn>
            </v-btn-group>

            <v-row no-gutters>
              <v-col :cols="8">
                <v-text-field
                    v-model="searchText"
                    density="compact"
                    label="Поиск объектов"
                    prepend-inner-icon="mdi-magnify"
                    variant="solo-filled"
                    hide-details
                    single-line
                    flat
                />
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
                              density="compact"
                              label="Отсутствующие"
                              color="blue-darken-3"
                              hide-details
                          />
                          <v-switch
                              v-model="filter.objectWithDefects"
                              density="compact"
                              label="С дефектами"
                              color="blue-darken-3"
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

          <v-divider/>

          <v-sheet>

            <v-table height="350" density="compact" fixed-header class="text-caption elevation-0">
              <thead>
              <tr class="text-blue-darken-4">
                <th class="text-left">№ п/п</th>
                <th class="text-left">Наименование</th>
                <th class="text-left">Инв. №</th>
                <th class="text-left"></th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="(inspectionObject, i) in objectsSlice"
                  :key="inspectionObject._id"
                  @click.stop="navigateToObject(inspectionObject)"
              >
                <td style="min-width: 70px; width: 70px; max-width: 70px">{{ i + 1 }}</td>
                <td style="min-width: 100px; width: 100px; max-width: 100px">
                  {{ textSlicer(inspectionObject?.name, 100) }}
                </td>
                <td style="min-width: 100px; width: 100px; max-width: 100px">
                  {{ textSlicer(inspectionObject?.inventoryNumber, 25) }}
                </td>
                <td style="min-width: 50px; width: 50px; max-width: 50px">
                  <my-button-table-remove :prompt="'Удалить'" @click:yes="removeOneObject(inspectionObject._id)"/>
                </td>
              </tr>
              </tbody>
            </v-table>
            <v-divider/>
          </v-sheet>

          <div class="d-flex align-center mt-2">
            <v-pagination
                v-model="currentPage"
                density="comfortable"
                color="blue-grey-darken-2"
                show-first-last-page
                :length="totalPages"
                :total-visible="8"
            />
          </div>
        </v-card-text>

        <v-file-input class="d-none" ref="excelFileInput" accept=".xlsx" @change="onExcelFileInput"/>

      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {fetchAssignmentBlockOneById, uploadObjects} from "../../../../../utils/api/api_assignment_blocks";
import {removeObject, removeObjects} from "../../../../../utils/api/api_inspection_objects";
import {unixDateToMiddleDateString} from "../../../../../utils/functions";
import {serverURL} from "../../../../../constants/constants";
import {downloadFile} from "../../../../../utils/api/api_";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

export default {
  name: "block-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      loading: false,
      reportDownloading: false,
      blockMenuChangeVisibility: false,
      filterMenuVisible: false,
      filter: {
        objectIsMissing: null,
        objectWithDefects: null,
      },
    }
  },

  async beforeMount() {
    if (!this.selectedAssignmentBlock?._id) { // TODO: Логика при открытии карточки Блока со списком объектов
      this.navigateBack();
    } else {
      await fetchAssignmentBlockOneById(this.selectedAssignmentBlock._id)
          .then((resp) => {
            this.$store.commit('assignmentBlocks/SELECT', resp.data);
            sessionStorage.selectedAssignmentBlock = JSON.stringify(resp.data);
            this.$store.dispatch('inspectionObjects/FETCH', resp.data._id);
          })
          .catch(err => {
            console.log('Запись была удалена', err);
            sessionStorage.removeItem('selectedAssignmentBlock');
            this.$store.commit('assignmentBlocks/RESET_SELECTED');
            this.navigateBack();
            this.$store.commit('assignmentBlocks/ALERT_ERROR', 'К сожалению карточка больше не существует!');
          });
    }
  },

  mounted() {
    this.fetchInspectionObjects();
  },

  unmounted() {
    this.$store.commit('inspectionObjects/RESET_OBJECT_LIST');
  },

  computed: {
    selectedAssignmentBlock() {
      return this.$store.getters['assignmentBlocks/SELECTED'];
    },
    inspectionObjects() {
      return this.$store.getters['inspectionObjects/GET_OBJECTS'];
    },
    objectsFiltered() {
      if (typeof this.searchText === 'string' && this.searchText.length > 0) {
        return this.inspectionObjects.filter(object => {
          return [
            object?.address,
            object?.description,
            object?.objectType,
            object?.name,
            object?.model,
            object?.serialNumber,
            object?.status,
            object?.inventoryNumber
          ].filter(e => !!e).find(value => (new RegExp(this.searchText, "ig")).test(value));
        })
      } else {
        return this.inspectionObjects;
      }
    },
    objectsSlice() {
      return this.objectsFiltered.slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage)
    },
    totalObjects() {
      return this.objectsFiltered.length;
    },
    totalPages() {
      return Math.ceil(this.totalObjects / this.itemsPerPage);
    },
    dateFromTo() {
      const {startDate} = this.selectedAssignmentBlock;
      return unixDateToMiddleDateString(startDate);
    },
  },

  methods: {

    removeOneObject(ID) {
      removeObject(ID)
          .then(() => {
            this.fetchInspectionObjects();
            this.$store.commit('alert/SUCCESS', 'Адрес осмотра успешно удален');
          })
          .catch(() => {
            this.$store.commit('alert/ERROR', 'Неудалось удалить адрес осмотра');
          })
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
      downloadFile('Отчет.docx', `${serverURL}/report/${assignmentBlockId}/commercial-proposal`)
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
        uploadObjects(this.selectedAssignmentBlock._id, formData)
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
      const blockID = this.$store.getters['assignmentBlocks/SELECTED']._id;
      if (blockID) {
        this.$store.dispatch('inspectionObjects/FETCH', blockID);
      }
    },

    selectObject(inspectionObject) {
      // Записываем в session storage и в vuex store
      sessionStorage.setItem('selectedInspectionObject', JSON.stringify(inspectionObject));
      this.$store.commit('inspectionObjects/SELECT', _.cloneDeep(inspectionObject));
    },


    navigateToObject(inspectionObject) {
      this.selectObject(inspectionObject);
      navigateTo('/manager-menu/assignments/assignment/block/object');
    },

    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment');
    },


    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    removeObjectsAll(blockID) {
      removeObjects(blockID)
          .then(() => {
            this.$store.commit('alert/ERROR', 'Объекты успешно удалены');
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
