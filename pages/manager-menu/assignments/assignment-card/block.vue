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
            <div>
              <v-btn
                  color="blue-darken-1"
                  density="comfortable"
                  icon="mdi-pencil"
                  rounded
                  @click="blockMenuChangeVisibility = true"
              >
                <v-icon/>
                <v-tooltip activator="parent" location="left">
                  Редактировать Блок
                </v-tooltip>
              </v-btn>
            </div>
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

        <v-card-text>
          <div class="d-flex ga-4 align-center py-1">
            <my-search-bar
                style="min-width: 300px"
                label="Поиск"
                persistent-hint
                :hint="`Найдено: ${totalObjects}`"
                v-model="searchText"
                @btn:click="objectMenuAddVisibility = true"
            />
          </div>
          <v-sheet height="400px">
            <v-divider/>
            <v-table height="520px" fixed-header density="default" class="text-caption">
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
                  <c-remove-btn :prompt="'Удалить'" @click.stop=""/>
                </td>
              </tr>
              </tbody>
            </v-table>
            <v-divider/>
          </v-sheet>

        </v-card-text>

        <v-card-item>
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
        </v-card-item>
      </v-card>

      <!--    Block Menu Change-->
      <v-overlay v-model="blockMenuChangeVisibility" class="d-flex justify-center align-center">
        <block-change></block-change>
      </v-overlay>

      <!--    Object Menu Add-->
      <v-overlay v-model="objectMenuAddVisibility" class="d-flex justify-center align-center">
        <object-add></object-add>
      </v-overlay>

    </v-sheet>
  </v-overlay>
</template>

<script>
import {timestampToDateString} from "../../../../utils/functions.js";

export default {
  name: "block-card-page",

  data() {
    return {
      visibility: false,
      searchText: '',
      currentPage: 1,
      itemsPerPage: 20,
      blockMenuChangeVisibility: false,
      objectMenuAddVisibility: false,
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
      this.$store.commit('inspectionObjects/SELECT', inspectionObject);
      navigateTo('/manager-menu/assignments/assignment-card/object');
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