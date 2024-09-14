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
      <v-card-title>Редактирование</v-card-title>
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
              label="Инвентарный номер"
          />

          <my-text-field
              v-model="value.address"
              :rules="addressRules"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Адрес"
          />

          <v-textarea
              v-model="value.description"
              :rules="descriptionRules"
              color="blue-grey-darken-3"
              label="Описание объекта"
              max-rows="1"
              variant="outlined"
              auto-grow
          />

        </v-form>
      </v-card-item>
      <v-card-actions>
        <my-btn-submit
            text="Изменить"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sending"
            @click="changeValue"
        />
        <my-btn-clear text="Очистить" @click="value = null"/>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
import _ from "lodash";
import {showAlert} from "../utils/service/serverAPI";
import {changeInspectionObject} from "../utils/service/server";

export default {
  name: "c-inspection-object-change",
  props: {
    _object: Object,
  },
  mounted() {
    this.value = _.cloneDeep(this._object);
  },
  data: () => ({
    value: {},
    sending: false,
    formIsValid: false,
    snackBar: {},
    nameRules: [v => v?.length > 0 || 'Заполните поле'],
    inventoryNumberRules: [v => v?.length > 0 || 'Заполните поле'],
    addressRules: [v => v?.length > 0 || 'Заполните поле'],
    descriptionRules: [v => v?.length > 0 || 'Заполните поле'],
  }),
  methods: {
    async changeValue() {
      await this.$refs.form.validate();
      if (this.formIsValid) {
        this.sending = true;
        changeInspectionObject(this.value)
            .then(() => {
              this.snackBar = showAlert('Успешно').success();
              this.$emit('update:success');
            })
            .catch((err) => {
              this.snackBar = showAlert('Ошибка').error();
              console.log('Ошибка изменения', err);
            })
            .finally(() => {
              this.sending = false;
            })
      }
    }
  }
}
</script>