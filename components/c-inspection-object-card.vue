<template>
  <v-sheet
      rounded="lg"
      width="900px"
      elevation="12"
      color="white"
  >
    <v-card rounded="lg" variant="text">
      <v-card-title>{{ inspection_object.name + ' / ' + inspection_object.inventoryNumber }}</v-card-title>
      <v-card-subtitle>
        {{ inspection_object.description }}
      </v-card-subtitle>
      <v-card-item>
        <div class="d-flex ga-1">
          <v-chip rounded="lg" color="blue-grey-darken-4" density="compact">
            {{ 'Адрес: ' + inspection_object.address }}
          </v-chip>
          <v-chip rounded="lg" color="blue-grey-darken-4" density="compact">
            {{ 'Фотографий: ' + viewsPhotos.length + ' шт.' }}
          </v-chip>
        </div>
        <v-divider class="mt-4"/>
      </v-card-item>
      <v-card-text>
        <v-sheet
            @dragover.prevent="onDragover"
            @dragleave.stop="onDragleave"
            @drop.prevent="onDrop"
            max-height="500px"
            height="500px"
            style="overflow-y: scroll"
        >
          <v-sheet
              v-if="dragging"
              height="600px"
              border="md"
              class="bg-blue-grey-lighten-5 rounded-lg border-dashed d-flex justify-center align-center flex-column"
          >
            <div class="d-flex flex-column ga-4">
              <v-icon
                  class="w-100 h-100 text-blue-grey-darken-3"
                  size="x-large"
              >
                mdi-file-arrow-left-right-outline
              </v-icon>
              <div>Отпустите файл в окно для загрузки</div>
            </div>
          </v-sheet>

          <v-sheet
              v-if="!dragging"
              :class="{'d-none':dragging}"
              class="d-flex ga-2 flex-wrap align-center justify-center"
          >
            <v-card
                v-for="(item, itemI) of viewsPhotos"
                :key="item._id"
                variant="tonal"
                rounded="lg"
                color="blue-grey-darken-1"
                style="width: 32%"
            >
              <v-card-title></v-card-title>
              <v-card-subtitle>{{ 'Фото: ' + (itemI + 1) }}</v-card-subtitle>
              <v-card-item>
                <img
                    style="width: 245px; height: 245px; object-fit: cover"
                    class="rounded-lg d-block"
                    loading="lazy"
                    :src="item.url"
                    alt="loading..."
                >
              </v-card-item>
              <v-card-text>
                {{ item.description }}
<!--                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ab adipisci alias, architecto at aut-->
<!--                doloremque ea eaque eius est et expedita inventore ipsam iure magni maxime natus, nihil numquam officiis-->
<!--                omnis pariatur provident quas quos reiciendis rem rerum sequi sunt ut velit vero! Dicta eius odit-->
<!--                quidem. Ea, et.-->
              </v-card-text>
            </v-card>
          </v-sheet>

        </v-sheet>
        <v-divider class="mt-2"/>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import _ from "lodash";
import {serverURL} from "../constants/constants.js";

export default {
  name: "c-inspection-object-card",

  props: {
    inspection_object: Object,
  },

  mounted() {
    this.viewsPhotos = this.inspection_object?.photos.map(this.photoMap);
  },

  data: () => ({
    files: [],
    viewsPhotos: [],
    dragging: false,
    counter: 0,
  }),

  watch: {
    _inspectionObject() {
      this.viewsPhotos = this._inspectionObject?.photos.map(this.photoMap);
    }
  },

  methods: {

    photoMap(_photo) {
      return {
        _id: _photo._id,
        url: serverURL + '/photos/' + this.inspection_object._id + '/show/' + _photo._id,
        description: _photo.description
      }
    },

    onDragover(e, _id) {
      this.dragging = true;
      this.counter += 1;
    },

    onDragleave(e) {
      // console.log('e.target', e.target.cursor)
      this.dragging = false;
    },

    onDrop(e, _id) {
      this.files.push(...e.dataTransfer.files);
      // this.$refs.file.files = e.dataTransfer.files;
      // this.onChange();
      this.isDragging = false;
    },
  }
}
</script>