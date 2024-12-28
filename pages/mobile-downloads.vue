<template>
  <v-sheet class="d-flex flex-column ga-8 align-center justify-center h-100" border="sm">

    <v-card variant="flat" class="text-center ">
      <v-card-item>
        <div class="d-flex flex-column align-center rounded-xl">
          <v-img src="/assets/images/logotype.png" width="60" height="60" />
        </div>
      </v-card-item>
      <v-card-title class="text-body-2">
        Начните работать в Mobile Inspector
      </v-card-title>
      <v-card-subtitle class="text-caption">
        Скачайте для Android или IOS
      </v-card-subtitle>
    </v-card>

    <v-card color="teal-darken-1" variant="tonal" border="sm" :disabled="downloadingAndroid"
            :loading="downloadingAndroid"
            @click="androidAppDownload">
      <v-card-item>
        <div class="d-flex justify-center align-center ga-3" style="width: 250px; height: 100px">
          <v-icon color="teal-darken-4">mdi-android</v-icon>
          <v-icon color="teal-darken-4">mdi-download-box-outline</v-icon>
        </div>
      </v-card-item>
    </v-card>

    <v-card color="indigo" variant="tonal" border="sm" :disabled="true"
            :loading="downloadingIos"
            @click="iosAppDownload">
      <v-card-item>
        <div class="d-flex justify-center align-center ga-3" style="width: 250px; height: 100px">
          <v-icon color="indigo-darken-4">mdi-apple-ios</v-icon>
          <v-icon color="indigo-darken-4">mdi-download-box-outline</v-icon>
        </div>
      </v-card-item>
    </v-card>

  </v-sheet>
</template>

<script>
import {downloadFile} from "@/utils/api/api_";
import {serverURL} from "@/constants/constants";

export default {
  name: "mobile-downloads",

  data() {
    return {
      downloadingIos: false,
      downloadingAndroid: false,
    }
  },

  methods: {

    iosAppDownload() {
      this.downloadingIos = true;
      let timeoutID = setTimeout(() => {
        // downloadFile('mobileInspector.apk', `${serverURL}/reports/downloadMobileApplication`);
        this.downloadingIos = false;
        clearTimeout(timeoutID);
      }, 2000)
    },
    androidAppDownload() {
      this.downloadingAndroid = true;
      let timeoutID = setTimeout(() => {
        downloadFile('mobileInspector.apk', `${serverURL}/applications/androidApplication`);
        this.downloadingAndroid = false;
        clearTimeout(timeoutID);
      }, 2000)
    },
  }
}
</script>