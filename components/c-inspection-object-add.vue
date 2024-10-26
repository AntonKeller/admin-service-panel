<template>
  <v-sheet
      rounded="lg"
      elevation="6"
      color="grey-lighten-4"
  >
    <v-card
        rounded="lg"
        variant="text"
        width="800"
        color="blue-grey-darken-3"
    >
      <v-card-title>Новый объект</v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>
      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-2 mt-2">

          <my-text-field
              v-model="value.name"
              :rules="nameRules"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Заголовок"
          />

          <my-text-field
              v-model="value.inventoryNumber"
              :rules="inventoryNumberRules"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Заголовок"
          />

          <my-text-field
              v-model="value.address"
              :rules="addressRules"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Заголовок"
          />

          <v-textarea
              v-model="value.description"
              :rules="descriptionRules"
              color="blue-grey-darken-3"
              max-rows="1"
              variant="outlined"
              auto-grow
          />

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
import {showAlert} from "../utils/functions.js";

export default {
  name: "c-inspection-object-add",
  props: {
    _blockId: String,
  },
  data: () => ({
    value: null,
    sending: false,
    formIsValid: false,
    snackBar: {},
    nameRules: [v => v?.length > 0 || 'Заполните поле'],
    inventoryNumberRules: [v => v?.length > 0 || 'Заполните поле'],
    addressRules: [v => v?.length > 0 || 'Заполните поле'],
    descriptionRules: [v => v?.length > 0 || 'Заполните поле'],
  }),
  methods: {
    async sendValue() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.sending = true;
        sendInspectionObject(this._blockId, this.value)
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