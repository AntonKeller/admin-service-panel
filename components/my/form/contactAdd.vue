<template>
  <v-card :loading="sending" :disabled="sending" elevation="6" width="100vw" max-width="800">
    <v-card-title>
      <div class="d-flex justify-space-between align-center">
        <div>Создание новый записи контакт</div>
        <my-button-close-card @click="$emit('click:close')" class="align-self-start"/>
      </div>
    </v-card-title>
    <v-card-subtitle>
      Заполните поля (сведения о контакте)
    </v-card-subtitle>
    <v-card-item>
      <v-form v-model="formIsValid" ref="form" class="d-flex flex-column mt-2">
        <v-row dense>
          <v-col :cols="12">
            <v-text-field
                v-model="contact.firstName"
                v-bind="inputFieldStyle"
                label="Имя"
                :rules="[isNotEmptyRule]"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="contact.surname"
                v-bind="inputFieldStyle"
                label="Фамилия"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="contact.lastName"
                v-bind="inputFieldStyle"
                label="Отчетство"
            />
          </v-col>
          <v-col :cols="12">
            <v-text-field
                v-model="contact.phoneNumber"
                v-bind="inputFieldStyle"
                label="Номер телефона"
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
          @click="send"
      />
      <my-button-clear text="Очистить" @click="clear"/>
    </v-card-actions>
  </v-card>
</template>

<script>
import {isNotEmptyRule} from '@/utils/validators/functions';
import {addContact} from "../../../utils/api/api_contacts";
import {inputFieldStyle} from "@/configs/styles";

export default {
  name: "contactAdd",

  emits: ['add:success', 'click:close'],

  data() {
    return {
      contact: {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
      },
      sending: false,
      formIsValid: null,

      // import styles
      inputFieldStyle,
    }
  },

  methods: {

    isNotEmptyRule,

    async send() {

      await this.$refs.form.validate();

      if (!this.formIsValid) {
        this.$store.commit('alert/ERROR', 'Не все поля заполнены!');
        return;
      }

      this.sending = true;

      addContact(this.contact)
          .then(() => {
            this.$store.commit('alert/SUCCESS', 'Контакт успешно добавлен');
            this.$emit('add:success');
          })
          .catch(err => {
            console.log('Ошибка добавления контакта', err);
            this.$store.commit('alert/ERROR', 'Ошибка добавления контакта');
          })
          .finally(() => {
            this.sending = false;
          })
    },

    clear() {
      this.contact = {
        _id: null,
        firstName: null,
        surname: null,
        lastName: null,
        phoneNumber: null,
      }
    }
  }
}
</script>