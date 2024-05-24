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
  </v-card>
</template>

<script>
import axios from "axios";
import {serverURL} from "../../constants/constants";

export default {
  name: "modules-page",

  data: () => ({
    files: [],
    aUrl: null,
    imagePreview: null,
    img: null,
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
      console.log('response', await response.json())


      //
      // const reader = response.body.getReader();
      //
      // let data = []
      // let allBytes = 0
      //
      // // бесконечный цикл, пока идёт загрузка
      // while (true) {
      //   const {done, value} = await reader.read();
      //
      //   if (done) {
      //     console.log('break');
      //     break;
      //   }
      //
      //   data = data.concat(value);
      //   allBytes += value.length
      //   console.log(`Получено ${value.length} байт`)
      // }
      //
      // let consolidate = ""
      // let decoder = new TextDecoder("utf-8")
      //
      // data.forEach(arr => {
      //   consolidate += decoder.decode(arr);
      // })
      //
      // let fin = data.map(e => decoder.decode(e)).toString()
      // console.log(fin)
      //
      // let jsonArray = JSON.parse(consolidate);
      //
      // // console.log('bytes:', allBytes / (1024 ^ 2), "Mb")
      // // console.log('data', data)
      // // console.log('consolidate', consolidate)
      // // console.log('type consolidate', typeof consolidate)
      // // console.log('json', jsonArray)
      //
      // let link = document.createElement('a');
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