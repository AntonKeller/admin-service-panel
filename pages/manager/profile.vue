<template>
  <v-container fluid>
    <v-card variant="text">
      <v-card-title>Профиль пользователя</v-card-title>
      <v-card-item>
        <v-sheet elevation="0" height="400" width="400" class="px-4 py-6 bg-white border-sm rounded-lg">
          <v-card-subtitle class="text-caption">Данные профиля</v-card-subtitle>
          <v-form v-model="formIsValid" ref="form" class="d-flex flex-column  mt-2 px-2">
            <v-text-field
                v-model="profile.email"
                prepend-inner-icon="mdi-email-lock-outline"
                label="Email"
                variant="outlined"
                density="compact"
                disabled
                flat
            />
            <v-text-field
                v-model="profile.fullName"
                prepend-inner-icon="mdi-account"
                label="Имя для авторизации"
                variant="outlined"
                density="compact"
                disabled
                flat
            />
            <v-text-field
                v-model="profile.organization"
                prepend-inner-icon="mdi-account"
                label="Имя для авторизации"
                variant="outlined"
                density="compact"

                disabled
                flat
            />
            <v-text-field
                v-model="profile.login"
                prepend-inner-icon="mdi-account"
                label="Имя для авторизации"
                variant="outlined"
                density="compact"
                disabled
                flat
            />
            <v-text-field
                v-model="profile.password"
                prepend-inner-icon="mdi-lock-outline"
                label="Пароль для авторизации"
                variant="outlined"
                density="compact"
                class="d-none"
                disabled
                flat
            />
            <v-btn density="comfortable" size="small" variant="tonal">Изменить</v-btn>
          </v-form>



          <v-card-subtitle class="text-caption mt-4">Приложения</v-card-subtitle>
<!--          <v-sheet class="bg-blue-grey-lighten-5 d-flex flex-column">-->
<!--            <v-row>-->
<!--              <v-col cols="6">-->
<!--                <v-sheet class="px-4 py-4">-->
<!--                  <v-btn size="small" variant="tonal" prepend-icon="mdi-tray-arrow-down" @click="downloadMobileInspector">-->
<!--                    Мобильный инспектор-->
<!--                    <v-tooltip activator="parent" location="top">-->
<!--                      <div>Скачать приложение</div>-->
<!--                      <div>Мобильный инспектор</div>-->
<!--                    </v-tooltip>-->
<!--                  </v-btn>-->
<!--                </v-sheet>-->
<!--              </v-col>-->
<!--              <v-col cols="6">-->
<!--                <v-sheet class="px-4 py-4">-->
<!--                  <v-btn size="small" variant="tonal" prepend-icon="mdi-tray-arrow-down" @click="downloadMobileInspector">-->
<!--                    Мобильный инспектор-->
<!--                    <v-tooltip activator="parent" location="top">-->
<!--                      <div>Скачать приложение</div>-->
<!--                      <div>Мобильный инспектор</div>-->
<!--                    </v-tooltip>-->
<!--                  </v-btn>-->
<!--                </v-sheet>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-sheet>-->
        </v-sheet>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script>
import image from '../../public/assets/logotype.png';
import {downloadFile} from "../../utils/api/api_.js";
import {serverURL} from "../../constants/constants.js";
import {getProfile} from "../../utils/api/api_profile.js";
export default {
  name: "profile-page",
  data() {
    return {
      profile: {},
      image,
      login: null,
      password: null,
      formIsValid: false,
    }
  },
  mounted() {
    this.getProfile();
  },
  methods: {

    async getProfile() {
      const response = await getProfile();
      this.profile = response.data;
      // await this.$refs.form.validate();
      // if (this.formIsValid) {
      //   this.loading = true;
      //   const response = await getProfile();
      //   this.profile = response.data;
      // }
    },
    downloadMobileInspector() {
      downloadFile('mobileInspector.apk', `${serverURL}/applications/androidApplication`);
    }
  }
}
</script>