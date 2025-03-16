<template>
  <v-container fluid class="bg-white">
    <v-sheet>
      <v-card variant="text">
        <v-card-item>
          <v-btn v-bind="navigateBackBtnStyle" @click="$router.back">
            Назад
            <v-tooltip activator="parent" location="left">
              Вернуться назад
            </v-tooltip>
          </v-btn>
        </v-card-item>
      </v-card>

      <v-card :loading="loading" :disabled="loading" variant="flat" width="100vw" max-width="900">
        <v-card-title>Редактор записи о заказчике</v-card-title>
        <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>

        <v-card-text>
          <v-form v-model="formIsValid" ref="form">
            <v-row dense>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.shortName"
                    v-bind="inputFieldStyle"
                    label="Краткое наименование"
                    :rules="[isNotEmptyRule]"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.inn"
                    v-bind="inputFieldStyle"
                    label="ИНН"
                    :rules="[isINN]"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.fullName"
                    v-bind="inputFieldStyle"
                    label="Полное наименование"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.address"
                    v-bind="inputFieldStyle"
                    label="Юридический адрес"
                />
              </v-col>
              <v-col :cols="12">
                <v-text-field
                    v-model="customer.actualAddress"
                    v-bind="inputFieldStyle"
                    label="Фактический адрес"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.email"
                    v-bind="inputFieldStyle"
                    label="Email"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.phoneNumber"
                    v-bind="inputFieldStyle"
                    v-mask="options"
                    label="Номер телефона"
                    placeholder="+7 (___) ___-__-__"
                />
              </v-col>
              <v-col :cols="6">
                <v-text-field
                    v-model="customer.representativeFullName"
                    v-bind="inputFieldStyle"
                    label="ФИО Представителя"
                />
              </v-col>
              <v-col :cols="6" class="pl-2">
                <v-text-field
                    v-model="customer.representativePosition"
                    v-bind="inputFieldStyle"
                    label="Должность представителя"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <my-btn-submit text="Принять" :loading="loading" @click="changeCustomer"/>
          <my-button-clear text="Очистить" @click="clear"/>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script>
import {changeCustomer, fetchCustomerOneById} from "@/utils/api/api_customers";
import {navigateBackBtnStyle, inputFieldStyle} from "@/configs/styles";
import {isINN, isNotEmptyRule} from "@/utils/validators/functions";
import {navigateTo} from "nuxt/app";
import {vMaska} from "maska/vue"

export default {
  name: "customer-change-page",

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
      },

      templateUploading: false,

      loading: false,
      formIsValid: false,

      // import styles
      inputFieldStyle,
      navigateBackBtnStyle
    }
  },

  beforeMount() {
    fetchCustomerOneById(useRoute().params.customerId)
        .then(response => {
          this.customer = response.data;
        })
        .catch(err => {
          console.log('Такой заказчик не существует', err);
          this.$store.commit('alert/ERROR', 'Такой заказчик не существует');
          this.navigateBack();
        })
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
      // if (window.history.length <= 1) {
      navigateTo('/manager/customers');
      // } else {
      //   this.$router.back();
      // }
    },

    // downloadTemplate() {
    //   downloadFile('angles template.xlsx', serverURL + '/customers/downloadExcelTemplates');
    // },

    async changeCustomer() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не заполнены обязательные поля');
        return;
      }

      this.loading = true;

      changeCustomer(this.customer)
          .then(() => {
            this.$store.dispatch('customers/FETCH_CUSTOMERS');
            this.$store.commit('alert/SUCCESS', 'Запись о заказчике изменена');
            this.navigateBack();
          })
          .catch(err => {
            console.log('Ошибка изменения данных заказчика', err);
            this.$store.commit('alert/ERROR', 'Ошибка изменения записи о заказчике');
          })
          .finally(() => {
            this.loading = false;
          })
    },

    // onTemplateInput() {
    //   this.$refs.templateInput.click();
    // },

    // Событие загрузки файла
    // onFileChange(event) {
    //   const file = event.target.files[0];
    //   if (file) {
    //     this.templateUploading = true;
    //     const formData = new FormData();
    //     formData.append('photoAngles', file);
    //     unpackAnglesTemplates(formData)
    //         .then(response => {
    //           this.customer.template = response.data;
    //           this.$store.commit('alert/SUCCESS', 'Шаблон успешно загружен');
    //         })
    //         .catch(err => {
    //           console.log('Ошибка загрузки шаблона', err);
    //           this.$store.commit('alert/ERROR', 'Ошибка загрузки шаблона');
    //         })
    //         .finally(() => {
    //           this.templateUploading = false;
    //           this.$refs.templateInput.value = '';
    //         })
    //   }
    // },

    clear() {
      this.$refs.templateInput.value = '';
      this.customer = {
        _id: this.customer._id,
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