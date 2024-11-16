<template>
  <v-overlay
      :model-value="true"
      class="d-flex justify-center align-center"
      @click:outside="back"
  >
    <v-sheet
        rounded="sm"
        min-height="600"
        max-height="600"
        min-width="800"
        max-width="800"
        elevation="6"
    >
      <v-card rounded="sm" variant="text">

        <v-card-title>
          <div class="d-flex justify-space-between">
            <div class="text-wrap">
              {{ objectNameTitle }}
            </div>
            <v-btn
                class="ml-4"
                color="blue-darken-2"
                density="comfortable"
                icon="mdi-pencil"
                variant="tonal"
                rounded
                @click="objectMenuChangeVisibility = true"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Редактировать Объект
              </v-tooltip>
            </v-btn>
          </div>

        </v-card-title>

        <v-card-text class="d-flex flex-column ga-1">
          <span><b>Адрес: </b>{{ inspectionObject?.address || 'Адрес отсутствует' }}</span>
          <span>{{ inspectionObject?.description || 'Описание отсутствует' }}</span>
        </v-card-text>

        <v-card-item>
          <v-file-input
              v-model="files"
              class="d-none"
              variant="outlined"
              density="compact"
              capture="camera"
              accept=".jpg, .png, .jpeg"
              id="inputfile"
              type="file"
              @change="sendImages"
          />

          <v-divider class="my-2"/>

          <v-autocomplete
              v-model="angleSelected"
              :items="angles"
              prepend-inner-icon="mdi-radiobox-indeterminate-variant"
              no-data-text="Ракурсы отсутствуют"
              color="blue-grey-darken-3"
              label="Список ракурсов"
              density="compact"
              variant="solo"
              rounded="md"
              single-line
              persistent-hint
              :hint="`Ракурсов: ${angles.length} шт. | Фотографий: ${photoCount} шт.`"
          >
            <template v-slot:chip="{ props, item }">
              <v-chip
                  v-bind="props"
                  closable
                  color="blue-grey-darken-1"
                  density="comfortable"
                  rounded="md"
                  label
                  :text="item.raw?.name"
              />
            </template>
            <template v-slot:item="{ props, item }">
              <v-list-item
                  v-bind="props"
                  prepend-icon="mdi-radiobox-indeterminate-variant"
                  density="compact"
                  :title="item.raw?.name"
                  :subtitle="item.raw?.name"
              />
            </template>
          </v-autocomplete>

          <v-sheet v-if="!angleSelected" class="d-flex flex-column justify-center align-center" height="300">
            <div>
              <v-label>
                <v-icon>mdi-arrow-up-bold-circle-outline</v-icon>
              </v-label>
            </div>
            <div>
              <v-label>Выберите ракурс из выпадающего списка</v-label>
            </div>
          </v-sheet>

          <v-sheet v-if="angleSelected" class="d-flex flex-wrap ga-1 mt-1" style="overflow-y: scroll" height="325">
            <v-img
                v-for="img of photosBySelectedAngle"
                @click="selectImage(img)"
                :width="190"
                aspect-ratio="1/1"
                cover
                :src="img.src"
                class="border-sm"
            />
          </v-sheet>
        </v-card-item>
        <v-card-actions>
          <v-btn
              text="Добавить фото в ракурс"
              icon="mdi-camera-outline"
              color="blue-darken-3"
              variant="text"
              rounded
          >
            <v-icon/>
            <v-tooltip activator="parent" location="right">
              Добавить фото в ракурс
            </v-tooltip>
          </v-btn>
          <v-divider class="my-2"/>
        </v-card-actions>
      </v-card>

      <my-overlay v-model="imgFullWindowIsShow">
        <v-sheet class="bg-transparent d-flex flex-column">
          <img
              style="max-height: 94vh; max-width: 95vw; object-fit: contain"
              class="rounded-t-lg d-block"
              alt="loading..."
              loading="lazy"
              :src="selectedImg.src"
          />
        </v-sheet>
        <v-btn class="mt-1" color="red-darken-4" prepend-icon="mdi-close" @click="removeImg(selectedImg._id)">
          Удалить
        </v-btn>
      </my-overlay>

      <my-overlay v-model="objectMenuChangeVisibility">
        <object-change @change:success=""></object-change>
      </my-overlay>

    </v-sheet>
  </v-overlay>
</template>

<script>
import {removeImg, sendImg} from "../../../../../utils/api/api_images.js";
import {fetchAngles} from "../../../../../utils/api/api_angles.js";
import logotype from "../../../../../components/logotype.vue";

export default {
  name: "object-page",

  data() {
    return {
      visibility: false,
      files: [],
      photos: [],
      selectedImg: null,
      dragging: false,
      progress: 0,
      angleSelected: null,
      imgFullWindowIsShow: false,
      objectMenuChangeVisibility: false,
      columnMax: 4,
    }
  },

  mounted() {

    const timeoutID = setTimeout(() => {
      this.visibility = true;
      clearTimeout(timeoutID);
    }, 1);


    // Загружаем картинки в Store
    this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
  },

  unmounted() {
    this.$store.commit('inspectionObjects/RESET_SELECTED');
  },

  computed: {
    array() {
      return new Array(this.countPerRow).fill(new Array(this.columnMax)).map((e, i) => {
        return this.photosBySelectedAngle.slice(i * this.columnMax, (i + 1) * this.columnMax)
      });
    },
    countPerRow() {
      return Math.ceil(this.photosBySelectedAngle.length / this.columnMax);
    },
    photosBySelectedAngle() {
      if (this.angleSelected) {
        return this.$store.getters['angles/GET_ANGLE_BY_ID'](this.angleSelected?._id)?.photoList || [];
      }
      return [];
    },
    angles() {
      return this.$store.getters['angles/GET_ANGLES'];
    },
    inspectionObject() {
      return this.$store.getters['inspectionObjects/GET_SELECTED_OBJECT'];
    },
    objectNameTitle() {
      return (this.inspectionObject?.name || 'Имя отсутствует') + ' / ' + (this.inspectionObject?.inventoryNumber || 'Инв. номер отсутствует')
    },
    photoCount() {
      return this.$store.getters['angles/GET_PHOTO_COUNT'];
    }
  },

  methods: {

    selectImage(img) {
      this.selectedImg = img;
      this.imgFullWindowIsShow = true;

    },

    removeImg(_photoId) {
      console.log(this.angleSelected)
      removeImg(_photoId)
          .then(() => {
            this.imgFullWindowIsShow = false;

            this.angleSelected.photoList = this.angleSelected.photoList.filter(e => e._id !== _photoId);
            if (this.angleSelected.photoList.length === 0) {
              this.angleSelected = null;
            }

            this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
          })
          .catch(err => {
            console.log('Ошибка', err);
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