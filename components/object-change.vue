<template>
  <v-sheet rounded="sm" elevation="6" color="grey-lighten-4">
    <v-card
        rounded="sm"
        variant="text"
        width="800"
        color="blue-grey-darken-3"
    >
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>Редактирование объекта</div>
          <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
        </div>
      </v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>
      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1 mt-2">

          <my-text-field
              v-model="value.name"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Наименование"
          />

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
              v-model="value.cadNum"
              prepend-inner-icon="mdi-label-variant-outline"
              label="Кадастровый номер"
          />

          <my-text-field
              v-model="value.serialNumber"
              prepend-inner-icon="mdi-label-variant-outline"
              label="VIN номер"
          />

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
            text="Изменить"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sending"
            @click="changeValue"
        />
        <my-button-clear text="Очистить" @click="value = null"/>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
import _ from "lodash";
import {changeInspectionObject} from "../utils/api/api_inspection_objects";

export default {
  name: "object-change",
  mounted() {
    this.value = _.cloneDeep(this.$store.getters['inspectionObjects/GET_SELECTED']);
  },
  data: () => ({
    value: {
      name: null,
      inventoryNumber: null,
      model: null,
      cadNum: null,
      serialNumber: null,
      address: null,
      objectType: null,
      status: null,
    },
    sending: false,
    formIsValid: false,
  }),
  methods: {
    async changeValue() {
      // await this.$refs.form.validate();
      // if (this.formIsValid) {
        this.sending = true;
        changeInspectionObject(this.value)
            .then(() => {
              this.$store.commit('alert/SUCCESS', 'Объект успешно изменен');
              this.$emit('change:success');
            })
            .catch((err) => {
              this.$store.commit('alert/ERROR', 'Ошибка изменения объекта');
              console.log('Ошибка изменения', err);
            })
            .finally(() => {
              this.sending = false;
            })
      }
    // }
  }
}
</script>