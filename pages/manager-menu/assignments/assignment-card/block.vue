<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateBack"
  >
    <v-card
        rounded="sm"
        min-width="400"
        max-width="900"
        width="100vw"
        elevation="6"
    >
      <v-card-title>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex ga-1 align-center">
            {{ assignmentBlock.title }}
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
        <div class="d-flex ga-2">
          <b>Статус:</b> {{ assignmentBlock.status }}
        </div>
        <div class="d-flex ga-2">
          <b>Начало-Окончание:</b>{{ dateFromTo }}
        </div>

        <div class="d-flex ga-2">
          <b>Инспектор:</b> {{ inspectorName }}
        </div>
        <div class="d-flex ga-2">
          <b>{{ inspectorContactsTitle }}</b>
        </div>
      </v-card-subtitle>

      <v-card-text class="text-caption">
        <div class="d-flex ga-1 align-center py-1">
          <v-btn-group variant="text" color="blue-darken-4" density="compact">
            <v-btn
                prepend-icon="mdi-plus-box-multiple-outline"
                size="small"
                @click="objectMenuAddVisibility = true"
            >
              Добавить
              <v-tooltip activator="parent" location="top">
                Добавить новый объект
              </v-tooltip>
            </v-btn>
            <v-divider vertical/>
          </v-btn-group>

          <div>
            <v-menu activator="#menu-activator" location="top">
              <div class="d-flex align-center justify-center ga-1 mb-1">
                <v-btn
                    color="blue-darken-1"
                    density="comfortable"
                    icon="mdi-file-download-outline"
                    variant="flat"
                    rounded="lg"
                    @click="downloadObjectsTemplate"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="top">
                    Скачать шаблон для заполнения
                  </v-tooltip>
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    density="comfortable"
                    icon="mdi-table-arrow-up"
                    variant="flat"
                    rounded="lg"
                    @click="clickExcelInputFile"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="top">
                    Загрузить объекты из xlsx
                  </v-tooltip>
                </v-btn>
                <v-btn
                    icon="mdi-file-document-arrow-right-outline"
                    color="blue-darken-1"
                    density="comfortable"
                    variant="flat"
                    rounded="lg"
                    :loading="reportDownloading"
                    :disabled="reportDownloading"
                    @click="downloadReport"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="top">
                    Скачать отчет
                  </v-tooltip>
                </v-btn>
              </div>
            </v-menu>
            <v-btn id="menu-activator" variant="text" rounded="lg" density="comfortable" icon="mdi-dots-horizontal">
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Функции
              </v-tooltip>
            </v-btn>
          </div>

          <v-text-field
              v-model="searchText"
              density="compact"
              label="Поиск объектов"
              prepend-inner-icon="mdi-magnify"
              variant="solo-filled"
              flat
              hide-details
              single-line
          />

        </div>
        <v-divider/>
        <v-sheet>

          <v-table height="440" density="default" fixed-header class="text-caption elevation-0">
            <thead>
            <tr class="text-blue-darken-4">
              <th class="text-left">Объект</th>
              <th class="text-left">Адрес</th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="inspectionObject in objectsSlice"
                :key="inspectionObject._id"
                @click.stop="selectObject(inspectionObject)"
            >
              <td style="min-width: 200px; max-width: 200px">
                <div><b>Наименование: </b>{{ textSlicer(inspectionObject.name, 25) }}</div>
                <div><b>Инв. №: </b>{{ textSlicer(inspectionObject.inventoryNumber, 25) }}</div>
              </td>
              <td style="min-width: 200px; max-width: 200px">{{ textSlicer(inspectionObject.address, 50) }}</td>
              <td style="min-width: 30px; max-width: 30px">
                <c-remove-btn :prompt="'Удалить'" @click.stop="removeOneObject(inspectionObject._id)"/>
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
        <block-change @change:success="fetchObjects" @click:close="blockMenuChangeVisibility=false"></block-change>
      </v-overlay>

      <!--    Object Menu Add-->
      <v-overlay v-model="objectMenuAddVisibility" class="d-flex justify-center align-center">
        <object-add @add:success="fetchObjects" @click:close="objectMenuAddVisibility=false"></object-add>
      </v-overlay>

      <!--      Block Card Page-->
      <nuxt-page/>
    </v-card>
  </v-overlay>
</template>

<script>
import {removeObject} from "../../../../utils/api/api_inspection_objects.js";
import {uploadObjects} from "../../../../utils/api/api_assignment_blocks";
import {serverURL} from "../../../../constants/constants";
import {downloadFile} from "../../../../utils/api/api_";
import {showAlert} from "../../../../utils/functions";

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
      objectMenuAddVisibility: false,
      headers: [
        {title: 'Наименование', align: 'start', key: 'name', value: 'name'},
        {title: 'Тип', align: 'start', key: 'objectType', value: 'objectType'},
        {title: 'Модель', align: 'start', key: 'model', value: 'model'},
        {title: 'Адрес', align: 'start', key: 'address', value: 'address'}
      ],
      timeDateConfig: {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }
    }
  },

  beforeMount() {
    // Считываем Объект из session storage -> vuex store
    try {
      if (sessionStorage?.selectedInspectionObject) {
        this.$store.commit('inspectionObjects/SELECT', JSON.parse(sessionStorage?.selectedInspectionObject));
      }
    } catch (err) {
      sessionStorage.removeItem('selectedInspectionObject');
      console.log('[sessionStorage] Ошибка чтения selectedInspectionObject');
    }
  },

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
      if (this.activeObject._id) {

        const foundObject = newArray.find(item => item._id === this.activeObject._id);

        if (foundObject) {
          this.selectObject(foundObject);
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
      const {startDate, endDate} = this.assignmentBlock;
      const t1 = !isNaN(parseInt(startDate)) ? this.stringToDate(startDate) : '';
      const t2 = !isNaN(parseInt(endDate)) ? this.stringToDate(endDate) : '';
      return `${t1} - ${t2}`;
    },
  },

  methods: {
    goBack() {
      navigateTo('/manager-menu/assignments/assignment-card');
    },
    stringToDate(timestamp) {
      return (new Date(parseInt(timestamp))).toLocaleDateString(undefined, this.timeDateConfig);
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
      const currentObject = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM'];

      if (currentObject?._id) {
        // Обращаемся к состоянию <inspection Objects> и Загружаем его список
        this.$store.dispatch('inspectionObjects/FETCH', currentObject?._id);
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
    },
    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },
    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment-card');
    }
  }
}
</script>

<style>
.small-font td {
  font-size: 12px; /* Уменьшение шрифта */
}
</style>
