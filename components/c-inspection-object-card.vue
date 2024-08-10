<template>
  <v-sheet
      rounded="lg"
      max-width="1024px"
      elevation="6"
      color="white"
  >
    <v-card rounded="lg" variant="text">
      <v-card-title>{{ _object.name + ' / ' + _object.inventoryNumber }}</v-card-title>
      <v-card-subtitle>
        <div class="d-flex ga-2">
          <b>Адрес: </b>{{ _object.address }}
        </div>
        <div class="d-flex ga-2">
          <b>Фотографий: </b>{{ photos.length }} шт.
        </div>
        <div class="d-flex ga-2">
          <b>Описание: </b>{{ _object.description }}
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
        >

          <v-sheet
              v-if="dragging"
              height="600px"
              border="md"
              class="bg-blue-grey-lighten-5 rounded-lg border-dashed d-flex justify-center align-center flex-column"
          >
            <div class="d-flex flex-column ga-4">
              <v-icon class="w-100 h-100 text-blue-grey-darken-3" size="x-large">
                mdi-file-arrow-left-right-outline
              </v-icon>
              <div>Отпустите файл в окно для загрузки</div>
            </div>
          </v-sheet>

          <v-list v-if="!dragging" class="d-flex  ga-1 flex-wrap align-center justify-center">
            <v-list-item
                v-for="(item, itemI) of photos"
                :key="item._id"
                variant="text"
                rounded="lg"
                class="px-0 py-0"
                color="blue-grey-darken-1"
            >
              <img
                  style="width: 242px; height: 245px; object-fit: cover"
                  class="rounded-lg d-block"
                  loading="lazy"
                  :src="item.route"
                  alt="loading..."
                  @click="imageShow(item)"
              />

              <div class="d-flex align-center justify-space-between mt-1">
                <div>{{ '№ ' + (itemI + 1) }}</div>
                <v-btn
                    density="compact"
                    variant="tonal"
                    rounded="lg"
                    text="Удалить"
                    @click="removeImg(item._id)"
                />
              </div>

            </v-list-item>
          </v-list>

        </v-sheet>
        <v-divider class="mt-2"/>
      </v-card-text>
    </v-card>
    <my-overlay v-model="imgFullWindowIsShow">
      <img
          style="max-height: 90vh; max-width: 80vw;  object-fit: contain"
          class="rounded-xl d-block"
          loading="lazy"
          :src="selectedImg.route"
          alt="loading..."
      />
    </my-overlay>
  </v-sheet>
</template>

<script>
import {sendImg, removeImg, fetchImages} from "../utils/service/server";

export default {
  name: "c-inspection-object-card",

  props: {
    _object: Object,
  },

  data: () => ({
    files: [],
    photos: [],
    selectedImg: null,
    imgFullWindowIsShow: false,
    dragging: false,
    counter: 0,
    progress: 0,
  }),

  mounted() {
    this.fetchImages(this._object._id);
  },

  methods: {

    imageShow(_img) {
      this.selectedImg = _img;
      this.imgFullWindowIsShow = true;
    },

    removeImg(_photoId) {
      removeImg(_photoId)
          .then(() => {
            this.fetchImages(this._object._id);
          })
          .catch(err => {
            console.log('Ошибка', err);
          })
    },

    fetchImages(_objectId) {
      fetchImages(_objectId)
          .then(resp => {
            this.photos = resp.data;
            console.log('resp.data', resp.data)
          })
    },

    sendImages() {
      if (this.files && this.files.length > 0) {
        let step = 100 / this.files.length;
        for (let file of this.files) {
          let formData = new FormData();
          formData.append('image', file);
          sendImg(this._object._id, formData)
              .then(response => {
                this.fetchImages();
              })
              .catch(err => {
                console.log('Ошибка', err);
              })
          this.progress += Math.floor(step);
        }
        this.files = [];
      }
    },

    onDragover(e, _id) {
      this.dragging = true;
      this.counter += 1;
    },

    onDragleave(e) {
      this.dragging = false;
    },

    onDrop(e, _id) {
      this.files.push(...e.dataTransfer.files);
      this.sendImages();
      this.dragging = false;
    },
  }
}
</script>