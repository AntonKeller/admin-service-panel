<template>
  <v-card :loading="loading" :disabled="loading" width="100vw" max-width="900">

    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Редакторование данных заказчика</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form">

        <v-row dense>
          <v-col :cols="6">
            <my-text-field v-model="customer.shortName" :rules="[isNotEmptyRule]" label="Короткое наименование"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field v-model="customer.inn" label="ИНН"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.fullName" label="Полное наименование"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.address" label="Адрес"/>
          </v-col>
          <v-col :cols="6">
            <my-text-field v-model="customer.email" label="Email"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field
                v-model="customer.phoneNumber"
                v-mask="options"
                label="Номер телефона"
                placeholder="+7 (___) ___-__-__"
            />
          </v-col>
          <v-col :cols="6">
            <my-text-field v-model="customer.representativeFullName" label="ФИО Представителя"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field v-model="customer.representativePosition" label="Должность представителя"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.template" label="Шаблон" disabled/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-item>
      <div>
        <v-divider/>
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
      <my-btn-submit text="Изменить" :loading="loading" @click="changeCustomer"/>
      <my-btn-submit
          class="ml-auto"
          variant="text"
          text="Шаблон для заполнения"
          prepend-icon="mdi-tray-arrow-down"
          @click="downloadTemplate"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {changeCustomer, uploadTemplate} from "../utils/api/api_customers";
import {isNotEmptyRule} from "@/utils/validators/functions";
import {serverURL} from "../constants/constants";
import {downloadFile} from "../utils/api/api_";
import {vMaska} from "maska/vue"
import _ from "lodash";

export default {
  name: "customer-change",

  emits: ['change:success'],

  directives: {
    mask: vMaska
  },

  beforeMount() {
    this.customer = _.cloneDeep(this.$store.getters['customers/GET_SELECTED']);
  },

  data() {
    return {

      options: {
        mask: "+7 (###) ###-##-##",
        eager: true
      },

      customer: {
        _id: null,
        shortName: null,
        fullName: null,
        inn: null,
        address: null,
        email: null,
        phoneNumber: null,
        representativeFullName: null,
        representativePosition: null,
        template: null,
      },

      templateFile: null,
      loading: false,
      formIsValid: false,
    }
  },

  methods: {

    isNotEmptyRule,

    downloadTemplate() {
      downloadFile('angles template.xlsx', serverURL + '/customers/downloadExcelTemplates');
    },

    async changeCustomer() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не заполнены обязательные поля');
        return;
      }

      this.loading = true;

      changeCustomer(this.customer)
          .then(() => {
            this.$emit('change:success');
            this.$store.dispatch('customers/FETCH_CUSTOMERS');
            this.$store.commit('alert/SUCCESS', 'Запись о заказчике изменена');
          })
          .catch(err => {
            console.log('Ошибка изменения данных заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка изменения записи о заказчике');
          })
          .finally(() => {
            this.loading = false;
          })

      if (!this.templateFile) {
        return;
      }

      const formData = new FormData();
      formData.append('photoAngles', this.templateFile);
      uploadTemplate(this.customer._id, formData)
          .catch(err => {
            this.$store.commit('alert/ERROR', 'Не удалось загрузить шаблон');
            console.log('Не удалось отправить шаблон', err);
          })

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