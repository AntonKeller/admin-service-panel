<template>
  <v-sheet
      rounded="lg"
      max-width="1024px"
      min-width="1024px"
      elevation="6"
      color="white"
  >
    <v-card rounded="lg">

      <v-card-title>
        <v-sheet class="d-flex ga-2">
          <c-btn-change prompt="Редактировать Блок" @click="aBlockCardMenuChangeIsShow = true"/>
          {{ _assignmentBlock.title }}
        </v-sheet>
      </v-card-title>

      <v-card-subtitle>
        <div class="d-flex ga-2">
          <b>Статус:</b> {{ _assignmentBlock.status }}
        </div>
        <div class="d-flex ga-2">
          <b>Начало-Окончание:</b>
          {{ timeStringToDate(_assignmentBlock.startDate).toLocaleDateString() }} -
          {{ timeStringToDate(_assignmentBlock.endDate).toLocaleDateString() }}
        </div>

        <div class="d-flex ga-2">
          <b>Инспектор:</b> {{
            _assignmentBlock.inspector ?
                _assignmentBlock.inspector?.lastName + ' ' +
                _assignmentBlock.inspector?.firstName?.slice(0, 1) + '. ' +
                _assignmentBlock.inspector?.surName?.slice(0, 1) + '. ' :
                'Инспектор отсутствует'
          }}
        </div>
        <div class="d-flex ga-2">
          <b>{{ _assignmentBlock.inspector?.email }}</b>
          <b>/</b>
          <b>{{ _assignmentBlock.inspector?.phoneNumber }}</b>
        </div>
      </v-card-subtitle>

      <v-card-text>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              style="min-width: 300px"
              label="Поиск"
              persistent-hint
              :hint="`Найдено: ${totalItems}`"
              v-model="searchText"
              @update:modelValue="fetchObjectsDebounce"
              @btn:click="inspObjectCardAddIsShow = true"
          />
        </div>
        <v-sheet height="400px">
          <v-divider/>
          <v-table height="520px" fixed-header density="default" class="text-caption">
            <thead>
            <tr>
              <th class="text-left">Объект</th>
              <th class="text-left">Адрес</th>
              <th class="text-left">Описание</th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>

            <tr
                v-for="inspectionObject in inspectionObjects"
                :key="inspectionObject._id"
                :class="{'bg-yellow-lighten-3':draggingId===inspectionObject._id}"
                @click.stop="selectObject(inspectionObject)"
                @dragover="(e) => onDragover(e, inspectionObject._id)"
                @dragleave="onDragleave"
                @drop="(e) => onDrop(e, inspectionObject._id)"
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
          <v-text-field
              v-model="currentPage"
              color="blue-grey-darken-3"
              variant="outlined"
              density="compact"
              type="number"
              rounded="lg"
              hide-details
              style="width: 80px; max-width: 80px"
              @update:modelValue="fetchObjects"
          />
          <v-pagination
              v-model="currentPage"
              density="comfortable"
              color="blue-grey-darken-2"
              show-first-last-page
              :length="totalPages"
              :total-visible="8"
              @update:modelValue="fetchObjects"
          />
        </div>
      </v-card-item>
    </v-card>

    <my-overlay v-model="inspObjectCardIsShow">
      <c-inspection-object-card :inspection_object="selectedObject"/>
    </my-overlay>

    <my-overlay v-model="inspObjectCardAddIsShow">
      <c-inspection-object-card-add :_blockId="_assignmentBlock._id"/>
    </my-overlay>

    <my-overlay v-model="aBlockCardMenuChangeIsShow">
      <c-a-block-card-menu-change
          :_assignmentId="_assignmentId"
          :_block="_assignmentBlock"
          @update:success="this.fetchObjects"
      />
    </my-overlay>

  </v-sheet>
</template>

<script>
import _ from "lodash";
import {fetchInspectionObjects} from "../utils/service/server";
import {dataInspectionObjects} from "../configs/data-test/data-test-inspection-object";
import {timeStringToDate} from "../utils/service/serverAPI.js";

export default {
  name: "c-a-block-card-menu",

  components: {},

  props: {
    _assignmentId: String,
    _assignmentBlock: Object,
  },

  data: () => ({
    inspectionObjects: [],
    currentPage: 1,
    limitItems: 20,
    totalItems: null,
    totalPages: null,
    searchText: '',
    fetchingData: false,
    files: [],
    selectedObject: null,
    draggingId: false,
    aBlockCardMenuChangeIsShow: false,
    inspObjectCardIsShow: false,
    inspObjectCardAddIsShow: false,
  }),

  mounted() {
    this.fetchObjects();
    console.log(this._assignmentBlock)
  },

  watch: {
    _assignmentBlock() {
      this.fetchObjects();
    }
  },

  methods: {

    timeStringToDate,

    selectObject(_object) {
      this.selectedObject = _object;
      this.inspObjectCardIsShow = true;
    },

    onDragover(e, _id) {
      e.preventDefault();
      this.draggingId = _id;
    },

    onDragleave() {
      this.isDragging = false;
      this.draggingId = null;
    },

    onDrop(e, _id) {

      console.log(e.dataTransfer.files)
      e.preventDefault();
      this.files.push(...e.dataTransfer.files);
      // this.$refs.file.files = e.dataTransfer.files;
      // this.onChange();
      this.isDragging = false;
    },

    textSlicer(txt, size) {
      return txt?.length > size ? txt.slice(0, size - 3) + '...' : txt;
    },

    createQueryParams() {

      let queryParams = [
        this.currentPage && this.currentPage > 0 ? `page=${this.currentPage}` : null,
        this.limitItems && this.limitItems > 0 ? `limit=${this.limitItems}` : null,
        this.searchText && this.searchText.length > 0 ? `searchText=${this.searchText}` : null,
        this._assignmentBlock?._id ? `assignmentBlockId=${this._assignmentBlock?._id}` : null,
      ].filter(e => !!e).join('&');

      return queryParams && queryParams?.length > 0 ? `?${queryParams}` : '';
    },

    fetchObjectsDebounce: _.debounce(function () {
      this.fetchObjects();
    }, 1000),

    fetchObjects() {
      this.fetchingData = true;
      fetchInspectionObjects(this.createQueryParams())
          .then(resp => {
            this.inspectionObjects = resp.data?.data;
            this.currentPage = resp.data?.currentPage;
            this.limitItems = resp.data?.pageSize;
            this.totalItems = resp.data?.totalItems;
            this.totalPages = resp.data?.totalPages;
            console.log('objects: ', this.inspectionObjects);
          })
          .catch(err => {
            this.inspectionObjects = dataInspectionObjects;
            console.log('Ошибка получения объектов', err);
          })
          .finally(() => {
            this.fetchingData = false;
          })
    }
  }
}
</script>