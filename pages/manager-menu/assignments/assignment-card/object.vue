<template>
  <v-overlay
      :model-value="true"
      class="d-flex justify-center align-center"
      @click:outside="back"
  >
    <v-sheet
        rounded="sm"
        max-width="1024px"
        elevation="6"
    >
      <v-card rounded="sm" variant="text">
        <v-card-title>
          <v-sheet class="d-flex ga-2">
            <c-btn-change prompt="Редактировать объект" @click="objectMenuChangeVisibility = true"/>
            {{ objectNameTitle }}
          </v-sheet>
        </v-card-title>
        <v-card-subtitle>
          <div class="d-flex ga-2">
            <b>Адрес: </b>{{ inspectionObject?.address || 'Адрес отсутствует' }}
          </div>
          <div class="d-flex ga-2">
            <b>Фотографий: </b>{{ photos.length }} шт.
          </div>
          <div class="d-flex ga-2">
            <b>Описание: </b>{{ inspectionObject?.description || 'Описание отсутствует' }}
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
                rounded="sm"
            >
              <v-icon>mdi-camera-outline</v-icon>
            </v-chip>
          </v-label>
          <v-divider/>
        </v-card-item>
        <v-card-text>
          <v-sheet height="500px" max-height="500px" style="overflow-y: scroll">
            <v-list class="d-flex  ga-1 flex-wrap align-center justify-center">
              <v-list-item
                  v-for="(item, itemI) of photos"
                  :key="item._id"
                  color="blue-grey-darken-1"
                  class="px-0 py-0"
                  variant="text"
                  rounded="sm"
              >
                <v-sheet border="sm" rounded="sm" class="position-relative">
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

      <my-overlay v-model="objectMenuChangeVisibility">
        <object-change></object-change>
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
  </v-overlay>
</template>

<script>
import {fetchImages, removeImg, sendImg} from "../../../../utils/api/api_images.js";
import {fetchAngles} from "../../../../utils/api/api_angles.js";

export default {
  name: "object-card-page",
  data() {
    return {
      visibility: false,
      files: [],
      photos: [],
      selectedImg: null,
      dragging: false,
      progress: 0,
      imgFullWindowIsShow: false,
      objectMenuChangeVisibility: false,
    }
  },
  mounted() {
    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);

    this.fetchAnglesData();
  },
  unmounted() {
    this.$store.commit('inspectionObjects/RESET_SELECTED');
  },
  computed: {
    inspectionObject() {
      return this.$store.getters['inspectionObjects/GET_SELECTED_OBJECT'];
    },
    objectNameTitle() {
      return (this.inspectionObject?.name || 'Имя отсутствует') + ' / ' + (this.inspectionObject?.inventoryNumber || 'Инв. номер отсутствует')
    }
  },
  methods: {
    imageShow(_img) {
      this.selectedImg = _img;
      this.imgFullWindowIsShow = true;
    },

    removeImg(_photoId) {
      removeImg(_photoId)
          .then(() => {
            this.fetchImages(this.inspectionObject._id);
          })
          .catch(err => {
            console.log('Ошибка', err);
          })
    },

    fetchAnglesData(_id) {
      fetchAngles(this.inspectionObject._id).then(response => {
        this.photos = response.data;
      })
    },

    sendImages() {

      if (!Array.isArray(this.files) || this.files.length === 0) {
        this.$store.commit('inspectionObjects/ALERT_ERROR', 'Ошибка. Файлы не выбраны')
      }

      let step = 100 / this.files.length;

      for (let file of this.files) {

        let formData = new FormData();

        formData.append('image', file);

        sendImg(this.inspectionObject._id, formData)
            .then(() => {
              this.fetchImages();
            })
            .catch(err => {
              console.log('Ошибка', err);
            })

        this.progress += Math.floor(step);
      }
      this.files = [];
    },
    back() {
      navigateTo('/manager-menu/assignments/assignment-card/block');
    },
  }
}
</script>