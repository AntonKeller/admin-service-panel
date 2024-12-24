<template>
  <v-card width="750" :loading="loading" :disabled="loading">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новый заказчик</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>

    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

    <v-card-text>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1">

        <v-row no-gutters>
          <v-col :cols="12">
            <my-text-field v-model="customer.fullName" label="Полное наименование"/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col :cols="6">
            <my-text-field v-model="customer.shortName" label="Короткое наименование"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field v-model="customer.inn" label="ИНН"/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col :cols="12">
            <my-text-field v-model="customer.address" label="Адрес"/>
          </v-col>
        </v-row>

        <v-row no-gutters>
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
        </v-row>

        <v-row no-gutters>
          <v-col :cols="6">
            <my-text-field v-model="customer.representativeFullName" label="ФИО Представителя"/>
          </v-col>
          <v-col :cols="6" class="pl-2">
            <my-text-field v-model="customer.representativePosition" label="Должность представителя"/>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col :cols="12">
            <my-text-field v-model="customer.template" label="Шаблон" disabled/>
          </v-col>
        </v-row>
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
      <my-button-clear text="Очистить" @click="customer = {}"/>
      <my-btn-submit
          prepend-icon="mdi-tray-arrow-down"
          text="Шаблон для заполнения"
          class="ml-auto"
          variant="text"
          @click="downloadTemplate"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {addCustomer, uploadTemplate} from "../utils/api/api_customers";
import {serverURL} from "../constants/constants";
import {downloadFile} from "../utils/api/api_";
import {vMaska} from "maska/vue"

export default {
  name: "customer-add",

  emits: ['add:success'],

  directives: {
    mask: vMaska
  },

  data: () => ({

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
    customerFullNameRules: [v => v.length > 0 || 'Наименование не должно быть пустым'],
    customerInnRules: [
      v => v.length > 0 || 'ИНН не должен быть пустым',
      v => v.length <= 12 || 'ИНН не должен превышать 12 символов',

    ]
  }),

  methods: {
    downloadTemplate() {
      downloadFile('angles template.xlsx', serverURL + '/customers/downloadExcelTemplates');
    },
    async addCustomer() {
      await this.$refs.form.validate();
      if (this.formIsValid) {

        this.loading = true;

        const _id = await addCustomer(this.customer)
            .then((response) => {
              this.$emit('add:success');
              this.$store.commit('alert/SUCCESS', 'Успешно добавлен');
              return response.data._id;
            })
            .catch(err => {
              console.log('Ошибка добавления заказчика', err);
              this.$store.commit('alert/ERROR', 'Ошибка добавления');
            })
            .finally(() => {
              this.loading = false;
            })

        if (this.templateFile && _id) {
          const formData = new FormData();
          formData.append('photoAngles', this.templateFile);
          uploadTemplate(_id, formData)
              .then(() => {
                this.$emit('add:success');
              })
              .catch(err => {
                this.$store.commit('alert/ERROR', 'Не удалось загрузить шаблон');
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
      this.templateFile = null;
      this.$refs.templateInput.value = '';
    }
  },
}
</script>