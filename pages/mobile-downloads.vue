<template>
  <v-sheet class="d-flex flex-column ga-8 align-center justify-center h-100" border="sm">

    <v-card variant="flat" class="text-center">
      <v-card-item>
        <div class="d-flex flex-column align-center rounded-xl">
          <v-img src="/assets/images/logotype.png" width="60" height="60"/>
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

        <div
            class="d-flex justify-center align-center"
            style="width: 250px; height: 100px"
            v-if="androidProgressObject.process"
        >
          <v-progress-circular :model-value="androidProgressObject.percent" :rotate="360" :size="100" :width="10"
                               color="grey">
            <template v-slot:default> {{ androidProgressObject.percent }} %</template>
          </v-progress-circular>
        </div>
        <div
            class="d-flex justify-center align-center ga-3"
            style="width: 250px; height: 100px"
            v-if="!androidProgressObject.process"
        >
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
      androidProgressObject: {
        percent: 0,
        process: false,
      },
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
      if (!this.androidProgressObject.process) {
        this.downloadingAndroid = true;
        let timeoutID = setTimeout(() => {
          downloadFile('mobileInspector.apk', `${serverURL}/applications/androidApplication`, this.androidProgressObject);
          this.downloadingAndroid = false;
          clearTimeout(timeoutID);
        }, 2000)
      }
    },
  }
}
</script>