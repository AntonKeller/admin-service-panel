<template>
  <v-card :loading="sending" :disabled="sending"  elevation="6"  width="100vw" max-width="800">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Создание новый записи залогодатель</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>
    <v-card-subtitle>
      Заполните поля (сведения о залогодателе)
    </v-card-subtitle>
    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
        <v-row dense>
          <v-col :cols="12">
            <my-text-field v-model="pledger.firstName" :rules="[isNotEmptyRule]" label="Имя"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="pledger.surname" label="Фамилия"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="pledger.lastName" label="Отчество"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="pledger.inn" label="ИНН"/>
          </v-col>
          <v-col :cols="12">
            <my-text-field v-model="pledger.position" label="Должность"/>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>
    <v-card-actions>
      <my-btn-submit
          text="Добавить"
          prepend-icon="mdi-checkbox-multiple-marked-outline"
          :loading="sending"
          @click="send"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {addPledger} from "../../../utils/api/api_pledgers";
import {isNotEmptyRule} from '@/utils/validators/functions';

export default {
  name: "pledgerAdd",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      pledger: {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        inn: null,
        position: null,
      },
      formIsValid: null,
      sending: false,
    }
  },

  methods: {

    isNotEmptyRule,

    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Заполните обязательные поля!');
        return;
      }

      this.sending = true;

      addPledger(this.pledger)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Залогодатель успешно добавлен');
            this.$emit('add:success');
          })
          .catch((err) => {
            console.log('Ошибка добавления нового залогодателя', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления залогодателя!');
          })
          .finally(() => {
            this.sending = false;
          });
    },

    clear() {
      this.pledger = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        inn: null,
        position: null,
      }
    }
  }
}
</script>