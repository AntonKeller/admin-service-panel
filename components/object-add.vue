<template>
  <v-sheet elevation="6" color="grey-lighten-4">
    <v-card variant="text" width="800">
      <v-card-title>
        <div class="d-flex justify-space-between align-center">
          <div>Новый объект</div>
          <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
        </div>
      </v-card-title>
      <v-card-subtitle>Заполните поля</v-card-subtitle>
      <v-card-item>
        <v-form v-model="formIsValid" ref="form" class="d-flex flex-column ga-1 mt-2">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                  v-model="value.name"
                  v-bind="inputFieldStyle"
                  label="Наименование"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="value.inventoryNumber"
                  v-bind="inputFieldStyle"
                  label="Инвентарный номер"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="value.model"
                  v-bind="inputFieldStyle"
                  label="Заводской номер"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="value.cadNum"
                  v-bind="inputFieldStyle"
                  label="Кадастровый номер"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="value.serialNumber"
                  v-bind="inputFieldStyle"
                  label="VIN номер"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                  v-model="value.address"
                  v-bind="inputFieldStyle"
                  label="Адрес"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="value.objectType"
                  v-bind="inputFieldStyle"
                  label="Тип объекта"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="value.status"
                  v-bind="inputFieldStyle"
                  label="Наличие"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-item>
      <v-card-actions>
        <my-btn-submit
            text="Добавить"
            prepend-icon="mdi-checkbox-multiple-marked-outline"
            :loading="sending"
            @click="sendValue"
        />
        <my-button-clear text="Очистить" @click="this.value = {}"/>
      </v-card-actions>
    </v-card>
  </v-sheet>
</template>

<script>
import {sendInspectionObject} from "../utils/api/api_inspection_objects";
import {inputFieldStyle} from "@/configs/styles";

export default {
  name: "object-add",
  data() {
    return {
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

      // import styles
      inputFieldStyle,
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
              this.$store.commit('alert/SUCCESS', 'Объект успешно добавлен');
              this.$emit('add:success');
            })
            .catch((err) => {
              this.$store.commit('alert/ERROR', 'Ошибка добавления объекта');
              console.log('Ошибка добавления объекта', err);
            })
            .finally(() => {
              this.sending = false;
            })
      }
    }
  }
}
</script>