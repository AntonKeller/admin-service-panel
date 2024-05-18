<template>
  <v-card class="mx-auto" variant="text">
    <v-card-title>MODULES MENU</v-card-title>
    <v-card-item>

      <v-file-input
          label="File input"
          multiple
          v-model="files"
          @input="console.log('files', files)"
      ></v-file-input>

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


      let responseData = await axios.get('http://192.168.1.30/photos').then(e => e?.data);

      console.log(Buffer.from(responseData[0].buffer))

      //
      // let blob = new Blob([responseData[0].buffer], {type: 'image/png'})
      // console.log('blob', blob)
      //
      // // let blob = new Blob(["hello"]);
      // let url = URL.createObjectURL(blob);
      // let link = document.createElement('a')
      // link.href = url;
      // link.download = "file.png"
      // document.body.append(link)
      // link.click();
    },

    sendFile() {

      let file = this.files?.shift()
      let formData = new FormData();
      formData.append('file', file);

      console.log('file', file)
      console.log('formData', formData)

      // const formData = new FormData();
      // formData.append("files", this.files)

      axios.post(serverURL + '/photos/add',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
      ).then(response => {
        console.log('response', response)
      }).catch(err => {
        console.log('err', err)
      })

    }
  }
}
</script>