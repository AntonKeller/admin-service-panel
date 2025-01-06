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
                    @click="showLightbox(angleT.photos, img._id)"
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



        <my-overlay v-model="objectMenuChangeVisibility">
          <object-change
              @change:success="onObjectChangeSuccess"
              @click:close="objectMenuChangeVisibility=false"
          />
        </my-overlay>
      </v-card>
      <VueEasyLightbox
          :visible="lightboxVisible"
          :index="lightboxIndex"
          :imgs="lightboxImages"
          @hide="hideLightbox"
      />
    </v-sheet>
  </v-container>
</template>

<script>
import {removeImg, sendImg} from "../../../../../../utils/api/api_images";
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
      objectMenuChangeVisibility: false,
      columnMax: 4,

      // lightbox
      lightboxVisible: false,
      lightboxIndex: null,
    }
  },

  // 0, 0, 0, 0, 0, 0
  // 0, 1, 2, 3, 4, 5
  // 0, 1, 2, 3, 4, 5

  // 1, 1, 1, 1, 1,  1
  // 0, 1, 2, 3, 4,  5
  // 6, 7, 8, 9, 10, 11

  // 2,  2,  2,  2,  2,  2
  // 0,  1,  2,  3,  4,  5
  // 12, 13, 14, 15, 16, 17

  async mounted() {

    if (this.inspectionObject?._id) {
      // Загружаем картинки в Store
      await this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
    }

    this.readSessionStorage();

    console.log('anglesTransformed', this.anglesTransformed);
    console.log('anglesTransformedToArray', this.lightboxImages);
  },

  unmounted() {
    this.$store.commit('inspectionObjects/RESET_SELECTED');
  },

  computed: {
    lightboxImages() {
      const array = []

      this.anglesTransformed.forEach(angle => {
        angle.photos.forEach(img => {
          array.push({...img, title: angle.angleName})
        })
      });

      return array;
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
  },

  methods: {

    showLightbox(images, imgID) {
      this.lightboxImages = images;
      this.lightboxIndex = this.lightboxImages.findIndex(img => img._id === imgID);
      this.lightboxVisible = true;
    },

    hideLightbox() {
      this.lightboxVisible = false;
      this.lightboxIndex = null;
    },

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

    // TODO: Скорректировать
    removeImg(_photoId) {
      removeImg(_photoId)
          .then(() => {
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