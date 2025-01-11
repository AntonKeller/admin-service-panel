<template>
  <v-card :loading="loading" :disabled="loading" variant="flat" width="100vw" max-width="900">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новый заказчик</div>
        <v-btn
            density="comfortable"
            color="blue-grey-darken-2"
            icon="mdi-arrow-left"
            variant="text"
            rounded="lg"
            @click="navigateBack"
        >
          <v-icon/>
          <v-tooltip activator="parent" location="left">
            Назад
          </v-tooltip>
        </v-btn>
      </div>
    </v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form">

        <v-row dense>
          <v-col :cols="6">
            <my-text-field v-model="customer.shortName" label="Краткое наименование" :rules="[isNotEmptyRule]"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field v-model="customer.inn" label="ИНН" :rules="[isINN]"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.fullName" label="Полное наименование"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.address" label="Юридический адрес"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="customer.actualAddress" label="Фактический адрес"/>
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
            <my-text-field v-model="customerTemplate" label="Шаблон" disabled/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-item>
      <div>
        <v-label>Вы можете добавить или заменить шаблон</v-label>
        <v-btn
            append-icon="mdi-tray-arrow-up"
            text="Загрузить ракурсы"
            color="blue-darken-3"
            density="comfortable"
            variant="tonal"
            size="small"
            class="ml-2"
            :loading="templateUploading"
            @click="onTemplateInput"
        />
        <v-divider class="my-1"/>
      </div>
      <input
          ref="templateInput"
          type="file"
          class="d-none"
          accept=".xlsx"
          @change="onFileChange"
      />
    </v-card-item>

    <v-card-actions>
      <my-btn-submit text="Принять" :loading="loading" @click="addCustomer"/>
      <my-button-clear text="Очистить" @click="clear"/>
      <my-btn-submit
          prepend-icon="mdi-tray-arrow-down"
          text="Скачать пустой шаблон"
          class="ml-auto"
          variant="text"
          @click="downloadTemplate"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {addCustomer, unpackAnglesTemplates} from "../utils/api/api_customers";
import {isINN, isNotEmptyRule} from "@/utils/validators/functions";
import {serverURL} from "../constants/constants";
import {downloadFile} from "../utils/api/api_";
import {navigateTo} from "nuxt/app";
import {vMaska} from "maska/vue"


export default {
  name: "customer-add",

  emits: ['add:success'],

  directives: {
    mask: vMaska
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
        actualAddress: null,
        email: null,
        phoneNumber: null,
        representativeFullName: null,
        representativePosition: null,
        template: null,
      },

      templateUploading: false,

      loading: false,
      formIsValid: false,
      customerFullNameRules: [v => v.length > 0 || 'Наименование не должно быть пустым'],
      customerInnRules: [
        v => v.length > 0 || 'ИНН не должен быть пустым',
        v => v.length <= 12 || 'ИНН не должен превышать 12 символов',
      ]
    }
  },

  computed: {
    customerTemplate() {
      if (!!this.customer.template) {
        return this.customer.template.map(e => `${e?.type} [${e?.angles.length}]`)?.join(', ')
      }
      return null;
    }
  },

  methods: {

    isNotEmptyRule,
    isINN,

    navigateBack() {
      navigateTo('/manager-menu/customers');
    },

    downloadTemplate() {
      downloadFile('angles template.xlsx', serverURL + '/customers/downloadExcelTemplates');
    },

    async addCustomer() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не заполнены обязательные поля');
        return;
      }

      this.loading = true;

      addCustomer(this.customer)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Заказчик успешно добавлен');
            this.$store.dispatch('customers/FETCH_CUSTOMERS');
            navigateTo('/manager-menu/customers');
          })
          .catch(err => {
            console.log('Ошибка добавления заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    // Программно вызываем клик по скрытому input
    onTemplateInput() {
      this.$refs.templateInput.click();
    },

    // Событие загрузки файла
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.templateUploading = true;
        const formData = new FormData();
        formData.append('photoAngles', file);
        unpackAnglesTemplates(formData)
            .then(response => {
              this.customer.template = response.data;
              this.$store.commit('alert/SUCCESS', 'Шаблон успешно загружен');
            })
            .catch(err => {
              console.log('Ошибка загрузки шаблона', err);
              this.$store.commit('alert/ERROR', 'Ошибка загрузки шаблона');
            })
            .finally(() => {
              this.templateUploading = false;
              this.$refs.templateInput.value = '';
            })
      }
    },

    clear() {
      this.$refs.templateInput.value = '';
      this.customer = {
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
      }
    }
  },
}
</script>