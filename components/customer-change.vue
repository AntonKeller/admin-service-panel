<template>
  <v-card
      rounded="sm" width="700" elevation="6"
      :loading="loading"
      :disabled="loading"
  >

    <v-card-title>Редактор заказчика</v-card-title>

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

        <v-divider />

        <v-label>Загруженные ракурсы</v-label>
        <v-sheet max-height="200" style="overflow-y: scroll">
          <v-list max-height="200px">
            <v-list-item v-for="item of customer.template">
              <b>Объект:</b>{{item.type}}<b> Кол-во ракурсов:</b>{{item?.angles?.length}}
            </v-list-item>
          </v-list>
        </v-sheet>
<!--        <my-text-field v-model="customer.template" label="Шаблон" disabled/>-->
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
      <v-divider />
    </v-card-item>

    <v-card-actions>
      <my-btn-submit text="Изменить" :loading="loading" @click="changeCustomer"/>
      <my-btn-submit
          class="ml-auto"
          variant="text"
          text="Шаблон для заполнения"
          prepend-icon="mdi-tray-arrow-down"
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
import _ from "lodash";
import {showAlert} from "../utils/functions";
import {changeCustomer} from "../utils/api/api_customers";
import {downloadFile} from "../utils/api/api_.js";
import {serverURL} from "../constants/constants.js";

export default {
  name: "customer-change",

  emits: ['change:success'],

  props: {
    _customer: Object,
  },

  data() {
    return {
      customer: {
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        email: null,
        phoneNumber: null,
        template: null,
      },
      templateFile: null,
      loading: false,
      formIsValid: false,
      snackBar: {},
    }
  },

  mounted() {
    this.customer = _.cloneDeep(this._customer);
  },

  methods: {
    downloadTemplate() {
      downloadFile('template', serverURL + '/customers/downloadExcelTemplates');
    },
    async changeCustomer() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.loading = true;
        changeCustomer(this.customer)
            .then(() => {
              this.$emit('change:success');
              this.snackBar = showAlert('Успешно изменен').success();
            })
            .catch(err => {
              console.log('Ошибка изменения', err);
              this.snackBar = showAlert('Ошибка изменения').error();
            })
            .finally(() => {
              this.loading = false;
            })
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
  },
}
</script>