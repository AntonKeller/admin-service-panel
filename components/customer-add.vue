<template>
  <v-card
      rounded="sm" width="700" elevation="6"
      :loading="loading"
      :disabled="loading"
  >
    <v-card-title>Новый заказчик</v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1 mt-2">
        <my-text-field v-model="customer.fullName" label="Полное наименование"/>
        <div class="d-flex ga-2">
          <my-text-field v-model="customer.shortName" label="Короткое наименование"/>
          <my-text-field v-model="customer.inn" label="ИНН"/>
        </div>
        <my-text-field v-model="customer.address" label="Адрес"/>
        <div class="d-flex ga-2">
          <my-text-field v-model="customer.email" label="Email"/>
          <my-text-field v-model="customer.phoneNumber" label="Номер телефона"/>
        </div>
        <my-text-field v-model="customer.template" label="Шаблон" disabled/>
      </v-form>
    </v-card-text>

    <v-card-item>
      <div>
        <v-label>Вы можете добавить или заменить шаблон</v-label>
        <v-btn
            class="ml-2"
            color="blue-darken-3"
            density="comfortable"
            :append-icon="templateFile ? 'mdi-close' : 'mdi-tray-arrow-up'"
            :text="templateFile ? 'Убрать файл' : 'Загрузить ракурсы'"
            variant="tonal"
            size="small"
            @click="templateUpload"
        />
        <v-divider class="my-1"/>
      </div>
      <div class="d-flex ga-2 align-center">
        <input
            ref="templateInput"
            type="file"
            class="d-none"
            accept=".xlsx"
            @change="onFileChange"
        />
        <div v-if="templateFile">
          <v-label class="text-caption">Загружаемый файл:</v-label>
          <span class="text-caption ml-2">{{ templateFile?.name || '' }}</span>
        </div>
      </div>
    </v-card-item>

    <v-card-actions>
      <my-btn-submit text="Принять" :loading="loading" @click="addCustomer"/>
      <my-btn-clear text="Очистить" @click="customer = {}"/>
      <my-btn-submit
          prepend-icon="mdi-tray-arrow-down"
          text="Шаблон для заполнения"
          class="ml-auto"
          variant="text"
          @click="downloadTemplate"
      />
    </v-card-actions>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-card>
</template>

<script>
import {addCustomer, uploadTemplate} from "../utils/api/api_customers";
import {showAlert} from "../utils/functions";
import {downloadFile} from "../utils/api/api_";
import {serverURL} from "../constants/constants.js";

export default {
  name: "customer-add",

  emits: ['add:success'],

  data: () => ({
    customer: {
      shortName: null,
      fullName: null,
      inn: null,
      address: null,
      email: null,
      phoneNumber: null,
    },
    templateFile: null,
    loading: false,
    snackBar: {},
    formIsValid: false,
  }),

  methods: {
    downloadTemplate() {
      downloadFile('template', serverURL + '/customers/downloadExcelTemplates');
    },
    async addCustomer() {
      await this.$refs.form.validate();
      if (this.formIsValid) {

        this.loading = true;

        const _id = await addCustomer(this.customer)
            .then((response) => {
              this.$emit('add:success');
              this.snackBar = showAlert('Успешно добавлен').success();
              return response.data._id;
            })
            .catch(err => {
              console.log('Ошибка добавления заказчика', err);
              this.snackBar = showAlert('Ошибка добавления').error();
            })
            .finally(() => {
              this.loading = false;
            })

        if (this.templateFile && _id) {

          const formData = new FormData()
          formData.append('file', this.templateFile);

          uploadTemplate(_id, formData)
              .then(() => {
                console.log('Шаблон успешно отправлен');
                this.$emit('add:success');
              })
              .catch(err => {
                this.snackBar = showAlert('Не удалось отправить шаблон').success();
                console.log('Не удалось отправить шаблон', err);
              })
        }
      }
    },
    // Программно вызываем клик по скрытому input
    templateUpload() {
      if (this.templateFile) {
        this.templateFile = null;
        this.$refs.templateInput.value = '';
      } else {
        this.$refs.templateInput.click();
      }
    },
    // Событие загрузки файла
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.templateFile = file;
      }
    },
    clear() {
      this.customer = {
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        email: null,
        phoneNumber: null,
      }
      this.templateFile = null;
      this.$refs.templateInput.value = '';
    }
  },
}
</script>