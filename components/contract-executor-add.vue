<template>
  <v-card width="700">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Новый исполнитель (по договору)</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>
    <v-card-subtitle>Заполните поля</v-card-subtitle>
    <v-card-text>
      <v-form v-model="isValid" ref="form" class="d-flex flex-column ga-1">
        <my-text-field
            v-model="contractExecutor.companyName"
            prepend-inner-icon="mdi-file-sign"
            label="Наименование компании"
            placeholder="ООО 'ВЕБ РФ'"
        />
        <my-text-field
            v-model="contractExecutor.firstName"
            prepend-inner-icon="mdi-file-sign"
            label="Имя"
            placeholder="Иван"
        />
        <my-text-field
            v-model="contractExecutor.surname"
            prepend-inner-icon="mdi-file-sign"
            label="Фамилия"
            placeholder="Иванов"
        />
        <my-text-field
            v-model="contractExecutor.lastName"
            prepend-inner-icon="mdi-file-sign"
            label="Отчетство (При наличии)"
            placeholder="Иванович"
        />
        <my-text-field
            v-model="contractExecutor.position"
            prepend-inner-icon="mdi-file-sign"
            placeholder="Генеральный директор"
            label="Должность"
        />
      </v-form>
    </v-card-text>

    <v-card-actions>
      <my-btn-submit text="Добавить" :loading="loading" @click="sendContractExecutor"/>
      <my-btn-clear text="Очистить" @click="clear"/>
    </v-card-actions>

    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>

  </v-card>
</template>

<script>
import {addContractExecutor} from "../utils/api/api_contract_executors.js";
import {showAlert} from "../utils/functions.js";

export default {
  name: "contract-executor-add",

  emits: ['add:success'],

  data() {
    return {
      isValid: false,
      loading: false,
      snackBar: {},
      contractExecutor: {
        _id: null,
        companyName: null,
        firstName: null,
        surname: null,
        lastName: null,
        position: null,
      },
      rules: {
        companyName: [
          v => v?.length > 0 || 'Не должно быть пустое',
        ],
        firstName: [
          v => v?.length > 0 || 'Не должно быть пустое',
        ],
        surname: [
          v => v?.length > 0 || 'Не должно быть пустое',
        ],
        // lastName: [
        //   v => v?.length > 0 || 'Не должно быть пустое',
        // ],
        position: [
          v => v?.length > 0 || 'Не должно быть пустое',
        ],
      },
    }
  },

  methods: {
    async sendContractExecutor() {

      await this.$refs.form.validate();

      if (this.isValid) {

        this.loading = true;

        addContractExecutor(this.contractExecutor)
            .then(() => {
              this.snackBar = showAlert('Успешно добавлен').success();
              this.$emit('add:success');
            })
            .catch(err => {
              console.log('Ошибка добавления исполнителя', err)
              this.snackBar = showAlert('Не удалось добавить!').error();
            })
            .finally(() => {
              this.loading = false;
            })
      }
    },
    clear() {
      this.contractExecutor = {
        _id: null,
        companyName: null,
        firstName: null,
        surname: null,
        lastName: null,
        position: null,
      }
    }
  }
}
</script>