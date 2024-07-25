<template>
  <v-card class="mx-auto" variant="text">
    <v-card-title>MODULES MENU</v-card-title>
    <v-card-item>
      <img width="50px" height="50px" :src=img alt="err">
    </v-card-item>
    <v-card-item>
      <v-file-input
          label="File input"
          multiple
          v-model="files"
      />
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
    </v-card-item>
  </v-card>
</template>

<script>
import axios from "axios";
import {serverURL} from "../../constants/constants";

export default {
  name: "modules-page",

  data: () => ({
    // date: '1112227200000',
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

    base64ToArrayBuffer(base64) {
      let binaryString = atob(base64);
      let bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
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

      //
      // for (let i = 0; i < jsonArray.length; i++) {
      //   const file = jsonArray[i].files;
      //   const arrayBuffer = this.base64ToArrayBuffer(file.data);
      //   this.download(link, file.name, new Blob([arrayBuffer]));
      // }
    },


    async sendFile() {
      let fd = new FormData();
      fd.append('image', this.files[0])

      axios.post(serverURL + '/photos/add', fd)
          .then(resp => console.log('Файл добавлен успешно', resp))
          .catch(err => console.log('Ошибка добавления файла', err))
    }
  }
}
</script>