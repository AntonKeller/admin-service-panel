<template>
  <v-card class="mx-auto" variant="text">
    <v-card-title>MODULES MENU</v-card-title>
    <v-card-item>

      <v-file-input
          label="File input"
          multiple
          v-model="files"
      />

    </v-card-item>
    <v-card-item>
      <v-btn @click="getFile">Показать</v-btn>
      <v-btn @click="sendFile">Отправить</v-btn>
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
  }),

  methods: {

    async getFile() {

      // let url = URL.createObjectURL(this.files[0]);
      // let link = document.createElement('a');
      // link.href = url;
      // link.download = "file.jpg";
      // document.body.append(link);
      // link.click();
      let _id = "535e30b7-e771-4b02-824b-2d3fc9035778\n";
      let responseData = await axios.get('http://192.168.1.30/download/' + _id).then(r => r?.data)
      console.log('responseData', responseData)

      // new File()
      // let blb = new Blob([responseData[0]?.files]);
      // let url = URL.createObjectURL(responseData[0]?.files);
      // let link = document.createElement('a')
      // link.href = url;
      // link.download = "file.jpg"
      // document.body.append(link)
      // link.click();
    },

    async sendFile() {

      let txt_buffer = await this.files[0].text();
      console.log('array_buffer', txt_buffer)
      axios.post(serverURL + '/photos/add', txt_buffer)
          .then(resp => console.log('Файл добавлен успешно', resp))
          .catch(err => console.log('Ошибка добавления файла', err))


      // let blb = new Blob([binBuff])
      // let blb_txt = await blb.text();
      // // let blb2 = new Blob([blb_txt])
      // let enc = new TextEncoder();

      // console.log('binBuff', enc.encode(blb_txt))
      // console.log('bytes', binBuff)
      // let url = URL.createObjectURL(blb);
      // let link = document.createElement('a')
      // link.href = url;
      // link.download = "file.jpg"
      // document.body.append(link)
      // link.click();

      // let formData = new FormData();
      // formData.append('image', this.files[0]);
      //
      // console.log('_file:', this.files[0])
      // console.log('_formData:', formData)
      //
      // axios.post(serverURL + '/photos/add',
      //     formData,
      //     {
      //       headers: {
      //         'Content-Type': 'multipart/form-data'
      //       }
      //     }
      // ).then(response => {
      //   console.log('response', response)
      // }).catch(err => {
      //   console.log('err', err)
      // })

    }
  }
}
</script>