<template>
  <v-overlay
      v-model="visibility"
      class="d-flex justify-center align-center"
      @click:outside="navigateBack"
  >
    <v-sheet
        rounded="sm"
        max-width="1024px"
        min-width="1024px"
        elevation="6"
    >
      <v-card rounded="sm">

        <v-card-title>
          <div class="d-flex justify-space-between">
            <div>
              {{ assignmentBlock.title }}
            </div>

            <v-btn id="menu-activator" variant="text" rounded="sm" density="comfortable" icon="mdi-dots-horizontal">
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Функции
              </v-tooltip>
            </v-btn>
            <v-menu activator="#menu-activator" location="bottom">
              <div class="d-flex flex-column align-center justify-center ga-1 mt-1">
                <v-btn
                    color="blue-darken-1"
                    density="comfortable"
                    icon="mdi-pencil"
                    variant="tonal"
                    rounded
                    @click="blockMenuChangeVisibility = true"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="left">
                    Редактировать Блок
                  </v-tooltip>
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    density="comfortable"
                    icon="mdi-file-download-outline"
                    variant="tonal"
                    rounded
                    @click="downloadObjectsTemplate"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="left">
                    Скачать шаблон для заполнения
                  </v-tooltip>
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    density="comfortable"
                    icon="mdi-table-arrow-up"
                    variant="tonal"
                    rounded
                    @click="clickExcelInputFile"
                >
                  <v-icon/>
                  <v-tooltip activator="parent" location="left">
                    Загрузить объекты из xlsx
                  </v-tooltip>
                </v-btn>
              </div>
            </v-menu>
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

        <v-card-text class="text-caption" style="font-size: 10px">
          <div class="d-flex ga-4 align-center py-1">
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
              <v-btn
                  prepend-icon="mdi-tray-arrow-up"
                  size="small"
                  @click="clickExcelInputFile"
              >
                Загрузить
                <v-tooltip activator="parent" location="top">
                  Загрузить список объектов в формате xlsx
                </v-tooltip>
              </v-btn>
              <v-divider vertical/>
              <v-btn
                  prepend-icon="mdi-file-download-outline"
                  size="small"
                  @click="downloadReport"
              >
                Отчет
                <v-tooltip activator="parent" location="top">
                  Скачать отчет
                </v-tooltip>
              </v-btn>
            </v-btn-group>

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

            <v-table height="300" density="default" fixed-header class="text-caption elevation-0">
              <thead>
              <tr class="text-blue-darken-4">
                <th class="text-left">Объект</th>
                <th class="text-left">Адрес</th>
                <th class="text-left">Описание</th>
                <th class="text-left"></th>
              </tr>
              </thead>
              <tbody>
              <tr
                  v-for="inspectionObject in objectsSlice"
                  :key="inspectionObject._id"
                  @click.stop="selectObject(inspectionObject)"
              >
                <td style="min-width: 300px; max-width: 300px">
                  <div><b>Наименование: </b>{{ textSlicer(inspectionObject.name, 25) }}</div>
                  <div><b>Инв. номер: </b>{{ textSlicer(inspectionObject.inventoryNumber, 25) }}</div>
                </td>
                <td style="min-width: 250px; max-width: 250px">{{ textSlicer(inspectionObject.address, 50) }}</td>
                <td style="min-width: 400px; max-width: 400px">{{ textSlicer(inspectionObject.description, 80) }}</td>
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
      </v-card>

      <v-file-input class="d-none" ref="excelFileInput" accept=".xlsx" @change="onExcelFileInput"/>

      <!--    Block Menu Change-->
      <v-overlay v-model="blockMenuChangeVisibility" class="d-flex justify-center align-center">
        <block-change @change:success="fetchObjects"></block-change>
      </v-overlay>

      <!--    Object Menu Add-->
      <v-overlay v-model="objectMenuAddVisibility" class="d-flex justify-center align-center">
        <object-add @add:success="fetchObjects"></object-add>
      </v-overlay>

      <!--      Block Card Page-->
      <nuxt-page/>

    </v-sheet>
  </v-overlay>
</template>

<script>
import {showAlert, timestampToDateString} from "../../../../utils/functions";
import {uploadObjects} from "../../../../utils/api/api_assignment_blocks";
import {serverURL} from "../../../../constants/constants";
import {downloadFile} from "../../../../utils/api/api_";
import {removeObject} from "../../../../utils/api/api_inspection_objects.js";

export default {
  name: "block-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      loading: false,
      blockMenuChangeVisibility: false,
      objectMenuAddVisibility: false,
      headers: [
        {title: 'Наименование', align: 'start', key: 'name', value: 'name'},
        {title: 'Тип', align: 'start', key: 'objectType', value: 'objectType'},
        {title: 'Модель', align: 'start', key: 'model', value: 'model'},
        {title: 'Адрес', align: 'start', key: 'address', value: 'address'}
      ],
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
    inspectionObjects() {
      // TODO: Обновился список осматриваемых объектов -> обновляемый выделенный объект (если он был)
      // if (this.selectedObject?._id) {
      //   this.selectedObject = this.inspectionObjects.find(e => e._id === this.selectedObject?._id);
      // }
    }
  },

  computed: {
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
      const t1 = !isNaN(parseInt(startDate)) ? timestampToDateString(startDate) : '';
      const t2 = !isNaN(parseInt(endDate)) ? timestampToDateString(endDate) : '';
      return `${t1} - ${t2}`;
    },
  },

  methods: {
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
      const assignmentBlockId = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM']?._id;
      downloadFile('Отчет.docx', `${serverURL}/report/${assignmentBlockId}/commercial-proposal`);
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
        // Обращаемся к состоянию <inspection Objects>
        // Загружаем его список
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
