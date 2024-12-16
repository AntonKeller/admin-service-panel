<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateBack"
  >
    <v-card
        rounded="sm"
        min-width="400"
        max-width="1024"
        width="100vw"
        elevation="6"
    >
      <v-card-title>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex ga-1 align-center">
            {{ assignmentBlock.address }}
            <v-btn
                class="align-self-start"
                density="comfortable"
                color="blue-darken-3"
                icon="mdi-pencil"
                variant="text"
                rounded="lg"
                size="small"
                @click="blockMenuChangeVisibility = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Редактировать Блок
              </v-tooltip>
            </v-btn>
          </div>
          <my-button-close-card @click="goBack" class="align-self-start"/>
        </div>
      </v-card-title>

      <v-card-subtitle>
        <div class="d-flex flex-column ga-2">
          <div class="d-flex ga-2">
            <b>Начало:</b>{{ dateFromTo }}
          </div>

          <div class="d-flex ga-2">
            <b>Инспектор:</b> {{ inspectorName }}
          </div>

          <div class="d-flex ga-2">
            <b>{{ inspectorContactsTitle }}</b>
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
                <v-menu v-model="filterMenuVisible" activator="parent" :close-on-content-click="false" location="start">
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
                @click.stop="selectObject(inspectionObject)"
            >
              <td style="min-width: 70px; width: 70px; max-width: 70px">{{ i + 1 }}</td>
              <td style="min-width: 100px; width: 100px; max-width: 100px">
                {{ textSlicer(inspectionObject?.name, 100) }}
              </td>
              <td style="min-width: 100px; width: 100px; max-width: 100px">
                {{ textSlicer(inspectionObject?.inventoryNumber, 25) }}
              </td>
              <td style="min-width: 50px; width: 50px; max-width: 50px">
                <c-remove-btn :prompt="'Удалить'" @click:yes="removeOneObject(inspectionObject._id)"/>
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

      <!--    Block Menu Change-->
      <v-overlay v-model="blockMenuChangeVisibility" class="d-flex justify-center align-center">
        <block-change @change:success="onBlockChangeSuccess"
                      @click:close="blockMenuChangeVisibility=false"/>
      </v-overlay>

      <!--      Block Card Page-->
      <nuxt-page/>

    </v-card>
  </v-overlay>
</template>

<script>
import {removeObject, removeObjects} from "../../../../utils/api/api_inspection_objects.js";
import {uploadObjects} from "../../../../utils/api/api_assignment_blocks";
import {serverURL} from "../../../../constants/constants";
import {downloadFile} from "../../../../utils/api/api_";
import {showAlert, unixDateToMiddleDateString} from "../../../../utils/functions";
import axios from "axios";
import {navigateTo} from "nuxt/app";

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
      headers: [
        {title: 'Наименование', align: 'start', key: 'name', value: 'name'},
        {title: 'Тип', align: 'start', key: 'objectType', value: 'objectType'},
        {title: 'Модель', align: 'start', key: 'model', value: 'model'},
        {title: 'Адрес', align: 'start', key: 'address', value: 'address'}
      ],
    }
  },

  // beforeMount() {
  //   // Считываем Объект из session storage -> vuex store
  //   try {
  //     if (sessionStorage?.selectedInspectionObject) {
  //       this.$store.commit('inspectionObjects/SELECT', JSON.parse(sessionStorage?.selectedInspectionObject));
  //     }
  //   } catch (err) {
  //     sessionStorage.removeItem('selectedInspectionObject');
  //     console.log('[sessionStorage] Ошибка чтения selectedInspectionObject');
  //   }
  // },

  mounted() {
    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);
    // Зашли в карточку Блока -> загрузили список объектов
    this.fetchObjects();
  },

  unmounted() {
    // Сбрасываем store <Inspection Objects>
    this.$store.commit('inspectionObjects/RESET_OBJECT_LIST');
  },

  watch: {
    assignmentBlock() {
      // Изменился блок -> Обновляем список осматриваемых объектов
      this.fetchObjects();
    },
    inspectionObjects(newArray) {
      if (this.activeObject?._id) {

        const foundObject = newArray.find(item => item._id === this.activeObject._id);

        if (foundObject) {
          // Записываем в session storage и записываем во vuex store
          sessionStorage.selectedInspectionObject = JSON.stringify(foundObject);
          this.$store.commit('inspectionObjects/SELECT', foundObject);
        }
      }
    }
  },

  computed: {
    activeObject() {
      return this.$store.getters['inspectionObjects/GET_SELECTED_OBJECT'];
    },
    assignmentBlock() {
      return this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM'];
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
    inspectorName() {
      if (this.assignmentBlock.inspector) {
        const {firstName: a, surName: b, lastName: c} = this.assignmentBlock?.inspector;
        if (a || b || c) {
          return a + ' ' + b?.slice(0, 1) + '. ' + c?.slice(0, 1);
        }
      }
      return 'Инспектор отсутствует';
    },
    inspectorContactsTitle() {
      if (this.assignmentBlock.inspector) {
        const {email, phoneNumber} = this.assignmentBlock.inspector;
        return `${email} / ${phoneNumber}`;
      }
    },
    dateFromTo() {
      const {startDate} = this.assignmentBlock;
      return unixDateToMiddleDateString(startDate);
    },
  },

  methods: {

    onBlockChangeSuccess() {
      this.blocksStoreUpdate();
      this.fetchObjects();
      this.blockMenuChangeVisibility = false;
    },

    blocksStoreUpdate() {
      const assignmentID = this.$store.getters['assignments/GET_SELECTED_ITEM']?._id;
      if (assignmentID) {
        this.$store.dispatch('assignmentBlocks/FETCH', assignmentID);
      }
    },

    goBack() {
      navigateTo('/manager-menu/assignments/assignment-card');
    },

    removeOneObject(ID) {
      removeObject(ID)
          .then(() => {
            this.fetchObjects();
            this.snackBar = showAlert('Успешно удален').success();
          })
          .catch(() => {
            this.snackBar = showAlert('Ошибка удаления').error();
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
        uploadObjects(this.assignmentBlock._id, formData)
            .then(() => {
              this.$refs.excelFileInput.value = '';
              this.fetchObjects();
            })
            .catch(err => {
              this.snackBar = showAlert('Не удалось загрузить файл').error();
              console.log('Не удалось загрузить файл', err);
            })
      }
    },

    fetchObjects() {
      // Получаем ID Блока
      const currentObjectID = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']?._id;
      if (currentObjectID) {
        // Обращаемся к состоянию <inspection Objects> и Загружаем его список
        this.$store.dispatch('inspectionObjects/FETCH', currentObjectID);
      } else {
        // Отсутствует ID Блока по которому должны получить список объектов
        this.$store.commit('inspectionObjects/ALERT_ERROR', 'Отсутствует ID Блока в Store');
      }
    },

    selectObject(inspectionObject) {
      // Записываем в session storage
      sessionStorage.setItem('selectedInspectionObject', JSON.stringify(inspectionObject));
      // Записываем в vuex store
      this.$store.commit('inspectionObjects/SELECT', inspectionObject);
      // Открываем меню
      navigateTo('/manager-menu/assignments/assignment-card/block/object');
      console.log('[Block card] select object')
    },

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment-card');
    },

    removeObjectsAll(blockID) {
      removeObjects(blockID)
          .then(() => {
            this.snackBar = showAlert('Успешно удалены').success();
            this.fetchObjects();
          })
          .catch(err => {
            this.snackBar = showAlert('Ошибка удаления').error();
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
