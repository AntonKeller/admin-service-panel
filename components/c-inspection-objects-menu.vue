<template>
  <v-sheet
      rounded="lg"
      width="900px"
      elevation="12"
      color="white"
  >
    <v-card rounded="lg">

      <!--      <v-card-title>Объекты на осмотр</v-card-title>-->
      <v-card-title>Песочница тест</v-card-title>

      <v-card-subtitle>{{ _assignmentBlock.title }}</v-card-subtitle>

      <v-card-text>
        <div class="d-flex ga-4 align-center py-1">
          <my-search-bar
              style="min-width: 300px"
              label="Поиск"
              persistent-hint
              :hint="`Найдено: ${totalItems}`"
              v-model="searchText"
              @update:modelValue="fetchObjectsDebounce"
          />
        </div>
        <v-sheet height="400px">
          <v-divider/>
          <v-table height="520px" fixed-header density="compact">
            <thead>
            <tr>
              <th class="text-left">Наименование</th>
              <th class="text-left">Инвентарный номер</th>
              <th class="text-left">Адрес</th>
              <th class="text-left">Описание</th>
              <th class="text-left"></th>
            </tr>
            </thead>
            <tbody>

            <tr
                v-for="inspectionObject in inspectionObjects"
                :key="inspectionObject._id"
                class="text-caption"
                :class="{'bg-yellow-lighten-3':draggingId===inspectionObject._id}"
                @click.stop="selectObject(inspectionObject)"
                @dragover="(e) => onDragover(e, inspectionObject._id)"
                @dragleave="onDragleave"
                @drop="(e) => onDrop(e, inspectionObject._id)"
            >
              <td>
                {{ textSlicer(inspectionObject.name, 25) }}
              </td>
              <td>{{ textSlicer(inspectionObject.inventoryNumber, 25) }}</td>
              <td>{{ textSlicer(inspectionObject.address, 50) }}</td>
              <td>{{ textSlicer(inspectionObject.description, 80) }}</td>
              <td>
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

    <my-overlay v-model="inspectionObjectCardShow">
      <c-inspection-object-card :inspection_object="objectSelected"/>
    </my-overlay>

  </v-sheet>
</template>

<script>
import {fetchInspectionObjects} from "../utils/methods/inspection-objects-requests";
import {dataInspectionObjects} from "../configs/data-test/data-test-inspection-object";
import _ from "lodash";

export default {
  name: "c-inspection-objects-menu",

  props: {
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
    draggingId: false,
    inspectionObjectCardShow: false,
    objectSelected: null,
  }),

  mounted() {
    this.fetchObjects(this._assignmentBlock);
  },

  watch: {
    _assignmentBlock() {
      this.fetchObjects(this._assignmentBlock);
    }
  },

  methods: {

    selectObject(_obj) {
      this.objectSelected = _obj;
      this.inspectionObjectCardShow = true;
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

    fetchObjects(_block) {
      this.fetchingData = true;
      fetchInspectionObjects(this.createQueryParams())
          .then(resp => {
            this.inspectionObjects = resp.data?.data;
            this.currentPage = resp.data?.currentPage;
            this.limitItems = resp.data?.pageSize;
            this.totalItems = resp.data?.totalItems;
            this.totalPages = resp.data?.totalPages;
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