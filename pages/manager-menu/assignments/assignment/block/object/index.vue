<template>
  <v-container fluid>

    <v-card variant="text">
      <v-card-item>
        <v-btn v-bind="navigateBackBtnStyle" @click="$router.back">
          Назад
          <v-tooltip activator="parent" location="left">
            Вернуться назад
          </v-tooltip>
        </v-btn>
      </v-card-item>
    </v-card>

    <v-card variant="text">

      <v-card-title>{{ objectNameTitle }}</v-card-title>

      <v-card-subtitle>
        {{ inspectionObject?.address || 'Адрес отсутствует' }}
      </v-card-subtitle>

      <v-card-item>
        <div class="text-caption border-dashed border-sm px-1 rounded">
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
        <v-sheet max-height="700px"
                 class="d-flex flex-column ga-6 overflow-y-scroll overflow-x-hidden pb-6">
          <div v-for="angleT of anglesTransformed" class="d-flex flex-column ga-2">

            <div class="font-bold d-flex align-center">
              <v-chip label color="blue-darken-4" density="comfortable">
                {{ angleT.angleName }}
              </v-chip>
            </div>

            <v-sheet class="d-flex flex-wrap ga-2">
              <div v-for="img of angleT.photos" class="">
                <v-img
                    @click="showLightbox(img._id)"
                    :min-width="100"
                    :max-width="100"
                    :height="130"
                    aspect-ratio="1/1"
                    cover
                    :src="img['150x150']"
                    alt="Загрузка изображения..."
                    class="rounded cursor-pointer"
                />
              </div>
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

    <my-overlay v-model="questionIsVisible">
      <v-card color="red-darken-4" rounded="sm">
        <v-card-text>
          <v-icon>mdi-progress-question</v-icon>
          <span class="ml-2">Хотите удалить запись ?</span>
        </v-card-text>
        <v-card-actions>
          <v-btn @click.stop="removeImg" variant="elevated" text="Да"/>
          <v-btn @click.stop="questionIsVisible=false" text="Отмена"/>
        </v-card-actions>
      </v-card>
    </my-overlay>

    <VueEasyLightbox
        :visible="lightboxVisible"
        :index="initPhotoIndex"
        :imgs="lightboxImages"
        @hide="hideLightbox"
        @on-index-change="onChangeLightboxIndex"
    >
      <template #toolbar="{ toolbarMethods }">
        <div class="position-absolute left-0 right-0 bottom-0 d-flex justify-center ga-1 mb-2">
          <v-btn-group density="default" variant="flat">
            <v-btn @click="toolbarMethods.zoomIn" icon="mdi-magnify-plus-outline">
              <v-icon icon="mdi-magnify-plus-outline"/>
              <v-tooltip activator="parent" location="top start">
                Увеличить
              </v-tooltip>
            </v-btn>
            <v-btn @click="toolbarMethods.zoomOut" icon="mdi-magnify-minus-outline">
              <v-icon icon="mdi-magnify-minus-outline"/>
              <v-tooltip activator="parent" location="top start">
                Уменьшить
              </v-tooltip>
            </v-btn>
            <v-btn @click="questionIsVisible = true" icon="mdi-close-box-multiple-outline">
              <v-icon icon="mdi-close-box-multiple-outline"/>
              <v-tooltip activator="parent" location="top start">
                Удалить
              </v-tooltip>
            </v-btn>
          </v-btn-group>
        </div>
      </template>
    </VueEasyLightbox>
  </v-container>
</template>

<script>
import {removeImg, sendImg} from "@/utils/api/api_images";
import {navigateBackBtnStyle} from "@/configs/styles";
import {navigateTo} from "nuxt/app";
import _ from "lodash";

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

      questionIsVisible: false,

      // lightbox
      lightboxVisible: false,
      initPhotoIndex: null,
      currentPhotoIndex: null,
      currentPhotoId: null,

      // import styles
      navigateBackBtnStyle,
    }
  },

  watch: {
    initPhotoIndex() {
      if (this.initPhotoIndex !== null && this.initPhotoIndex !== undefined) {
        this.currentPhotoIndex = this.initPhotoIndex;
        console.log('\n\n--------------------------------------------------------------');
        console.log('Исполнен Watcher [initPhotoIndex]');
        console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
        console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
        console.log('this.currentPhotoId:\t', this.currentPhotoId);
        console.log('--------------------------------------------------------------\n');
      }
    },
    currentPhotoIndex() {
      if (this.lightboxImages[this.initPhotoIndex]?._id) {
        this.currentPhotoId = this.lightboxImages[this.initPhotoIndex]?._id;
        console.log('\n\n--------------------------------------------------------------');
        console.log('Исполнен Watcher [currentPhotoIndex]');
        console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
        console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
        console.log('this.currentPhotoId:\t', this.currentPhotoId);
        console.log('--------------------------------------------------------------\n');
      }
    }
  },

  async mounted() {
    if (this.inspectionObject?._id) {
      await this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
    }
    this.readSessionStorage();
  },

  unmounted() {
    this.$store.commit('inspectionObjects/RESET_SELECTED');
  },

  computed: {
    lightboxImages() {
      const array = []
      this.anglesTransformed.forEach(angle => {
        angle.photos.forEach(img => {
          array.push({
            _id: img._id,
            src: img.fullSize,
            title: angle.angleName
          });
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

    onChangeLightboxIndex(oldIndex, newIndex) {
      if (!_.isNil(newIndex) && !_.isNil(this.lightboxImages[newIndex]?._id)) {
        this.initPhotoIndex = newIndex;
      }
      console.log('\n\n--------------------------------------------------------------');
      console.log('Исполнено событие обновления [Lightbox Index]');
      console.log('--------------------------------------------------------------');
      console.log('Параметры события:');
      console.log('Старый индекс:\t', oldIndex);
      console.log('Новый индекс:\t', newIndex);
      console.log('--------------------------------------------------------------');
      console.log('Состояние Data:');
      console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
      console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
      console.log('this.currentPhotoId:\t', this.currentPhotoId);
      console.log('--------------------------------------------------------------\n');
    },

    showLightbox(imgID) {
      this.initPhotoIndex = this.lightboxImages.findIndex(img => img._id === imgID);
      this.lightboxVisible = true;
    },

    hideLightbox() {
      this.lightboxVisible = false;
      this.initPhotoIndex = null;
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

    removeImg() {
      const photoId = this.currentPhotoId;

      console.log('\n\n--------------------------------------------------------------');
      console.log('Информаци о состоянии до удаления');
      console.log('--------------------------------------------------------------');
      console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
      console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
      console.log('this.currentPhotoId:\t', this.currentPhotoId);
      console.log('this.lightboxImages.length:\t', this.lightboxImages.length);
      console.log('--------------------------------------------------------------\n');


      console.log('lightboxImages.len - currentPhotoIndex:', (this.lightboxImages.length - 1) - this.currentPhotoIndex)

      if (photoId) {
        removeImg(photoId)
            .then(async () => {

              // Запросим новые ракурсы с фотографиями
              // if (this.inspectionObject?._id) {
              //   await this.$store.dispatch('angles/FETCH', this.inspectionObject._id);
              // }

              // Если удаление на сервере успешно -> удаляем из store
              this.$store.commit('angles/REMOVE_PHOTO_BY_ID', photoId);

              // Если фотографий не осталось
              if (this.lightboxImages.length === 0) {
                this.lightboxVisible = false;
                this.initPhotoIndex = null;
                this.currentPhotoIndex = null;
                this.currentPhotoId = null;
              }

              if (this.lightboxImages.length > 0) {

                if (this.currentPhotoIndex >= this.lightboxImages.length) {
                  this.initPhotoIndex -= 1;
                }

                if (this.currentPhotoIndex < this.lightboxImages.length) {
                  this.currentPhotoId = this.lightboxImages[this.currentPhotoIndex]._id;
                }

              }

            })
            .catch(err => {
              console.log('Ошибка удаления фотографии', err);
            })
            .finally(() => {
              this.questionIsVisible = false;

              console.log('\n\n--------------------------------------------------------------');
              console.log('Информаци о состоянии после удаления');
              console.log('--------------------------------------------------------------');
              console.log('this.initPhotoIndex:\t', this.initPhotoIndex);
              console.log('this.currentPhotoIndex:\t', this.currentPhotoIndex);
              console.log('this.currentPhotoId:\t', this.currentPhotoId);
              console.log('this.lightboxImages.length:\t', this.lightboxImages.length);
              console.log('--------------------------------------------------------------\n');
            })
      }
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