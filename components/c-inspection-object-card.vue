<template>
  <v-sheet
      rounded="lg"
      max-width="1024px"
      elevation="6"
      color="white"
  >
    <v-card rounded="lg" variant="text">
      <v-card-title>{{ inspection_object.name + ' / ' + inspection_object.inventoryNumber }}</v-card-title>
      <v-card-subtitle>
        <div class="d-flex ga-2">
          <b>Адрес: </b>{{ inspection_object.address }}
        </div>
        <div class="d-flex ga-2">
          <b>Фотографий: </b>{{ viewsPhotos.length }} шт.
        </div>
        <div class="d-flex ga-2">
          <b>Описание: </b>{{ inspection_object.description }}
        </div>
      </v-card-subtitle>
      <v-card-item>
        <v-file-input
            v-model="files"
            id="inputfile"
            class="my-1 d-none"
            variant="outlined"
            density="compact"
            type="file"
            accept="image/*"
            capture="camera"
            @change="sendImages"
        />
        <v-label for="inputfile">
          <v-chip
              class="my-1"
              rounded="lg"
              variant="elevated"
              color="blue-grey-darken-3"
          >
            <v-icon>mdi-camera-outline</v-icon>
          </v-chip>
        </v-label>
        <v-divider/>
      </v-card-item>
      <v-card-text>
        <v-sheet
            @dragover.prevent="onDragover"
            @dragleave.stop="onDragleave"
            @drop.prevent="onDrop"
            max-height="500px"
            height="500px"
            style="overflow-y: scroll"
            @scroll="onScroll"
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
                v-for="(item, itemI) of slicePhotos()"
                :key="item._id"
                variant="tonal"
                rounded="lg"
                color="blue-grey-darken-1"
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
              <v-card-text>{{ item.description }}</v-card-text>
            </v-card>
          </v-sheet>

        </v-sheet>
        <v-divider class="mt-2"/>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
import {serverURL} from "../constants/constants";
import {sendImg} from "../utils/service/server";

export default {
  name: "c-inspection-object-card",

  props: {
    inspection_object: Object,
  },

  mounted() {
    console.log('this.inspection_object', this.inspection_object)
    this.viewsPhotos = this.inspection_object?.photos?.map(this.photoMap);
  },

  data: () => ({
    files: [],
    page: 1,
    maxPages: null,
    sliceSize: 6,
    viewsPhotos: [],
    dragging: false,
    counter: 0,
    progress: 0,
  }),

  watch: {
    _inspectionObject() {
      this.viewsPhotos = this._inspectionObject?.photos.map(this.photoMap);
    }
  },

  methods: {

    slicePhotos() {
      this.maxPages = Math.ceil(this.viewsPhotos.length / this.sliceSize);
      // console.log('this.viewsPhotos?.slice(0, this.sliceSize)',this.viewsPhotos?.slice(0, this.sliceSize))
      // return this.viewsPhotos?.slice((this.page -1) * this.sliceSize, this.page * this.sliceSize);
      return this.viewsPhotos?.slice(0, this.page * this.sliceSize);
    },

    onScroll(e) {
      let scrollPercent = ((e?.target?.scrollTop + e?.target?.clientHeight) / e?.target?.scrollHeight);
      if (scrollPercent >= 0.99) {
        this.page += 1;
        console.log('Прокручен');
      }
    },

    sendImages() {
      if (this.files && this.files.length > 0) {
        let step = 100 / this.files.length;
        for (let file of this.files) {
          let formData = new FormData();
          formData.append('image', file);
          sendImg(this.inspection_object._id, formData)
              .then(response => {
                this.$emit('update:success');
              })
              .catch(err => {
                console.log('Ошибка', err);
              })
          this.progress += Math.floor(step);
        }
        this.files = [];
      }
    },

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