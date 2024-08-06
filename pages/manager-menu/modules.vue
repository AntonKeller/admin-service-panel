<template>
  <v-card class="mx-auto" variant="text">
    <v-card-title>MODULES MENU</v-card-title>
    <v-card-item>
      <img width="50px" height="50px" :src=img alt="err">
    </v-card-item>
    <v-card-item>
      <v-sheet
          class="d-flex justify-center align-center"
          height="80px"
          :class="{'border-dashed':isDragging}"
          :border="isDragging ? 'lg' : ''"
          color="blue-grey-lighten-4"
          @dragover="onDragover"
          @dragleave="onDragleave"
          @drop="onDrop"
      >
        {{ isDragging ? '-> Добавить файлы <-' : files.map(e => e.name).join(', ') }}
      </v-sheet>
      <v-file-input
          v-model="files"
          multiple
          chips
          label="File input"
      />
      <div class="text-center">
        <v-progress-circular :model-value="progress" :rotate="360" :size="100" :width="15" color="teal">
          <template v-slot:default> {{ progress }} %</template>
        </v-progress-circular>
      </div>
    </v-card-item>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-btn variant="tonal" color="blue-darken-4" @click="getFile">Скачать</v-btn>
        <v-btn variant="tonal" color="blue-darken-4" @click="sendFile">Отправить</v-btn>
      </div>
    </v-card-item>
    <v-card-text>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem praesentium, voluptatum. Aspernatur
      consequatur
      dolore, doloribus esse eveniet facere ipsa itaque maxime nam natus porro provident quia ratione sequi
      temporibus
      tenetur voluptas? Cupiditate dolorem mollitia rerum? Excepturi illum labore molestias nobis numquam odit
      pariatur
      quia quo, sit, soluta tenetur unde voluptatum.
    </v-card-text>
    <v-card-item>
      <my-date-picker
          v-model="date"
          label="Дата"
          :rules="rules"
          @update:modelValue="_v => console.log('date:', _v)"
      />
      <v-btn @click="req5">
          download
      </v-btn>
    </v-card-item>
    <v-card-item class="py-15">
      <v-label>Camera</v-label>
      <input type="file" accept="image/*" capture="camera">
    </v-card-item>
  </v-card>
</template>

<script>
import axios from "axios";
import {serverURL} from "../../constants/constants";

export default {
  name: "modules-page",

  data: () => ({
    progress: 0,
    isDragging: false,
    date: null,
    files: [],
    aUrl: null,
    imagePreview: null,
    img: null,
    rules: [
      value => /^\d\d\.\d\d\.\d\d\d\d$/i.test(value) ? true : 'Неподходящий формат даты',
    ]
  }),

  methods: {

    async req5() {
      const response = await axios.get('http://192.168.1.18/photos/026a450d-bdd7-431c-8924-54fcb1d565ee/downloadAllPhotos');
      // const data = await response.json();
      console.log('data', response.data)
    },

    onDragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },

    onDragleave() {
      this.isDragging = false;
    },

    onDrop(e) {

      console.log(e.dataTransfer.files)
      e.preventDefault();
      this.files.push(...e.dataTransfer.files);
      // this.$refs.file.files = e.dataTransfer.files;
      // this.onChange();
      this.isDragging = false;
    },


    download(link, name, blob) {
      link.href = URL.createObjectURL(blob);
      link.download = name;
      document.body.append(link);
      link.click();
    },

    async getFile() {

      const response = await fetch(serverURL + '/photos');
      const data = await response.json();

      console.log('element', data[0]?._id);

      // const response2 = await fetch(serverURL + '/photos/download/' + data[0]?._id);
      // console.log('response2', response2);
      let name = data[0]?._id + ".jpeg";
      console.log('name', name)

      let link = document.createElement('a');
      link.href = serverURL + '/photos/download/' + data[0]?._id;
      link.download = name;
      document.body.append(link);
      link.click();
    },


    async sendFile() {
      if (this.files && this.files.length > 0) {

        let formData = new FormData();
        let errors = [];
        let success = []
        let step = 100 / this.files.length;

        for (let i = 0; i < this.files.length; i++) {

          formData.append('image', this.files[i])

          await axios.post(serverURL + '/photos/add', formData)
              .then(response => {
                success.push('Успешно для', this.files[i]?.name);
              })
              .catch(err => {
                errors.push('Ошибка для', this.files[i]?.name, err)
              })

          this.progress += Math.floor(step);
        }

        this.progress = 0;
        console.log('Данные по отправке файлов: [ошибка/успешно]', errors.length, '/', success.length, '\n')
        console.log('success', success);
        console.log('errors', errors);
      }
    }
  }
}
</script>