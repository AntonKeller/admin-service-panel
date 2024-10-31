<template>
  <v-sheet
      rounded="lg"
      max-width="1024px"
      elevation="6"
  >
    <v-card rounded="lg" variant="text">
      <v-card-title>
        <v-sheet class="d-flex ga-2">
          <c-btn-change prompt="Редактировать объект" @click="objectCardChangeIsShow = true"/>
          {{ _object.name + ' / ' + _object.inventoryNumber }}
        </v-sheet>
      </v-card-title>
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
            class="my-1 d-none"
            variant="outlined"
            density="compact"
            capture="camera"
            accept="image/*"
            id="inputfile"
            type="file"
            @change="sendImages"
        />
        <v-label for="inputfile">
          <v-chip
              color="blue-grey-darken-3"
              variant="elevated"
              class="my-1"
              rounded="lg"
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
            style="overflow-y: scroll"
            max-height="500px"
            height="500px"
        >

          <v-sheet
              v-if="dragging"
              class="bg-blue-grey-lighten-5 rounded-lg border-dashed d-flex justify-center align-center flex-column"
              height="600px"
              border="md"
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
                color="blue-grey-darken-1"
                class="px-0 py-0"
                variant="text"
                rounded="lg"
            >
              <v-sheet border="sm" rounded class="position-relative">
                <img
                    style="width: 242px; height: 245px; object-fit: cover"
                    class="rounded-lg d-block"
                    alt="loading..."
                    loading="lazy"
                    :src="item.route"
                    @click="imageShow(item)"
                />
              </v-sheet>
              <v-btn
                  @click="removeImg(item._id)"
                  color="blue-grey"
                  density="compact"
                  text="Удалить"
                  variant="tonal"
                  rounded
                  block
              />
            </v-list-item>
          </v-list>

        </v-sheet>
        <v-divider class="mt-2"/>
      </v-card-text>
    </v-card>

    <my-overlay v-model="objectCardChangeIsShow">
      <c-inspection-object-change :_object="_object" @update:success="$emit('update:success')"/>
    </my-overlay>

    <my-overlay v-model="imgFullWindowIsShow">
      <img
          style="max-height: 90vh; max-width: 80vw; object-fit: contain"
          class="rounded-xl d-block"
          alt="loading..."
          loading="lazy"
          :src="selectedImg.route"
      />
    </my-overlay>
  </v-sheet>
</template>

<script>
import {sendImg, removeImg, fetchImages} from "../utils/api/api_images";

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
    objectCardChangeIsShow: false,
    dragging: false,
    counter: 0,
    progress: 0,
  }),

  mounted() {
    this.fetchImages(this._object._id);
    console.log('_object', this._object)
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
          })
    },

    sendImages() {
      if (this.files && this.files.length > 0) {
        let step = 100 / this.files.length;
        for (let file of this.files) {
          let formData = new FormData();
          formData.append('image', file);
          sendImg(this._object._id, formData)
              .then(() => {
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