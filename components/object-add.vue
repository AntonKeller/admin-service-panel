<template>
  <v-sheet
      rounded="sm"
      elevation="6"
      color="grey-lighten-4"
  >
    <v-card
        rounded="sm"
        variant="text"
        width="800"
        color="blue-grey-darken-3"
    >
      <v-card-title>Новый объект</v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>
      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1 mt-2">

          <my-text-field
              v-model="value.name"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Наименование"
          />

          <div class="d-flex ga-2">
            <my-text-field
                v-model="value.inventoryNumber"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Инвентарный номер"
            />

            <my-text-field
                v-model="value.model"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Заводской номер"
            />

            <my-text-field
                v-model="value.serialNumber"
                prepend-inner-icon="mdi-label-variant-outline"
                label="VIN номер"
            />
          </div>

          <my-text-field
              v-model="value.address"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Адрес"
          />

          <div class="d-flex ga-2">
            <my-text-field
                v-model="value.objectType"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Тип объекта"
            />

            <my-text-field
                v-model="value.status"
                prepend-inner-icon="mdi-label-variant-outline"
                label="Наличие"
            />
          </div>
        </v-form>
      </v-card-item>
      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sending"
            @click="sendValue"
        />
        <my-btn-clear text="Очистить" @click="this.value = null"/>
      </v-card-actions>
    </v-card>
    <v-snackbar :color="snackBar.type" v-model="snackBar.isShow">
      <v-icon>mdi-alert-circle-outline</v-icon>
      {{ snackBar.msg }}
    </v-snackbar>
  </v-sheet>
</template>

<script>
import {sendInspectionObject} from "../utils/api/api_inspection_objects";
import {showAlert} from "../utils/functions";

export default {
  name: "object-add",
  data() {
    return {
      value: {
        name: null,
        inventoryNumber: null,
        model: null,
        serialNumber: null,
        address: null,
        objectType: null,
        status: null,
      },
      sending: false,
      formIsValid: false,
      snackBar: {},
      inventoryNumberRules: [v => v?.length > 0 || 'Заполните поле'],
      descriptionRules: [v => v?.length > 0 || 'Заполните поле'],
      addressRules: [v => v?.length > 0 || 'Заполните поле'],
      nameRules: [v => v?.length > 0 || 'Заполните поле'],
    }
  },
  computed: {
    assignmentBlock() {
      return this.$store.getters['assignmentBlocks/GET_SELECTED_ITEM'];
    },
  },
  methods: {
    async sendValue() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.sending = true;
        sendInspectionObject(this.assignmentBlock._id, this.value)
            .then(() => {
              this.snackBar = showAlert('Успешно').success();
              this.$emit('add:success');
            })
            .catch((err) => {
              this.snackBar = showAlert('Ошибка').error();
              console.log('Ошибка добавления', err);
            })
            .finally(() => {
              this.sending = false;
            })
      }
    }
  }
}
</script>