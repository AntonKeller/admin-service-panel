<template>
  <v-container fluid>
    <v-sheet>
      <v-card variant="text">

        <v-card-title>
          <div class="d-flex align-center justify-space-between">
            <div class="text-wrap mr-6">
              {{ objectNameTitle }}
            </div>
            <v-btn
                density="comfortable"
                color="blue-grey-darken-2"
                icon="mdi-arrow-left"
                variant="text"
                rounded="lg"
                @click="navigateBack"
            >
              <v-icon/>
              <v-tooltip activator="parent" location="left">
                Назад
              </v-tooltip>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-subtitle>
          {{ inspectionObject?.address || 'Адрес отсутствует' }}
        </v-card-subtitle>

        <v-card-item>
          <div class="text-caption">
            {{ inspectionObject?.description || 'Описание отсутствует' }}
          </div>
        </v-card-item>

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

        <v-card-item>
          <v-sheet style="overflow-y: scroll" max-height="700" class="pr-8">
            <div v-for="(angleT, i) of anglesTransformed">
              <div class="py-2 font-bold d-flex align-center" :class="i !== 0 ? 'mt-2' : ''">
                <v-chip label color="blue-darken-4" density="comfortable">
                  {{ angleT.angleName }}
                </v-chip>
              </div>
              <v-sheet style="overflow-y: scroll" height="120" class="d-flex pb-2">
                <v-img
                    v-for="img of angleT.photos"
                    @click="selectImage(img)"
                    :min-width="150"
                    :max-width="150"
                    :height="120"
                    aspect-ratio="1/1"
                    cover
                    :src="img.src"
                    alt="Загрузка изображения..."
                    class="border-sm rounded mr-2"
                />
              </v-sheet>
            </div>
          </v-sheet>
        </v-card-item>

        <my-overlay v-model="imgFullWindowIsShow">
          <v-sheet class="bg-transparent d-flex flex-column">
            <img
                style="max-height: 94vh; max-width: 95vw; object-fit: contain; transform: scaleX(100%)"
                class="rounded-t-lg d-block"
                alt="Загрузка изображения..."
                loading="lazy"
                :src="selectedImg.src"
            />
          </v-sheet>
          <v-btn class="mt-1" color="red-darken-4" prepend-icon="mdi-close" @click="removeImg(selectedImg._id)">
            Удалить
          </v-btn>
        </my-overlay>

        <my-overlay v-model="objectMenuChangeVisibility">
          <object-change
              @change:success="onObjectChangeSuccess"
              @click:close="objectMenuChangeVisibility=false"
          />
        </my-overlay>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {removeImg, sendImg} from "../../../../../../utils/api/api_images.js";
import {navigateTo} from "nuxt/app";

export default {
  name: "object-page",

  data() {
    return {
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

  async mounted() {

    if (this.inspectionObject?._id) {
      // Загружаем картинки в Store
      await this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
    }

    this.readSessionStorage();
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
    anglesTransformed() {
      const transformed = [];
      this.angles.forEach(angle => {
        transformed.push({
          angleName: angle.name,
          photos: angle.photoList.map(img => img)
        });
      });
      return transformed;
    },
    angles() {
      return this.$store.getters['angles/GET_ANGLES'];
    },
    inspectionObject() {
      return this.$store.getters['inspectionObjects/GET_SELECTED'];
    },
    objectNameTitle() {
      return (this.inspectionObject?.name || 'Имя отсутствует') + ' / ' + (this.inspectionObject?.inventoryNumber || 'Инв. номер отсутствует')
    },
    photoCount() {
      return this.$store.getters['angles/GET_PHOTO_COUNT'];
    }
  },

  methods: {

    navigateBack() {
      navigateTo('/manager-menu/assignments/assignment/block');
    },

    onObjectChangeSuccess() {
      this.objectMenuChangeVisibility = false;
      this.updateObjectsStore();
    },

    updateObjectsStore() {

      // Получаем ID Блока
      const currentObject = this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM'];

      if (currentObject?._id) {
        // Обращаемся к состоянию <inspection Objects> и Загружаем его список
        this.$store.dispatch('inspectionObjects/FETCH', currentObject?._id);
      } else {
        // Отсутствует ID Блока по которому должны получить список объектов
        this.$store.commit('inspectionObjects/ALERT_ERROR', 'Отсутствует ID Блока в Store');
      }
    },

    readSessionStorage() {
      // Считываем Просматриваемый ракурс из session storage -> vuex store
      if (!sessionStorage.selectedAngleId) return;

      // Проверяем наличие такого в store
      const has = this.$store.getters['angles/HAS_ANGLE'](sessionStorage.selectedAngleId);
      if (!has) return;

      this.angleSelected = this.$store.getters['angles/GET_ANGLE_BY_ID'](sessionStorage.selectedAngleId);
    },

    onSelectAngle(angle) {
      if (angle) {
        sessionStorage.setItem('selectedAngleId', angle._id);
      }
    },

    selectImage(img) {
      this.selectedImg = img;
      this.imgFullWindowIsShow = true;
    },

    removeImg(_photoId) {
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
            console.log('Ошибка удаления фотографии', err);
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
              console.log('Ошибка отправки фотографии', err);
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