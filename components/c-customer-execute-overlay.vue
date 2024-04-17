<template>
  <v-card density="compact" rounded="lg" variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Новый заказчик</v-card-title>
    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.name"
          hide-details="auto"
          label="Наименование организации"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.inn"
          hide-details="auto"
          label="ИНН"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.phoneNumber"
          hide-details="auto"
          label="Телефон"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.emailAddress"
          hide-details="auto"
          label="Почта"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="customer.address"
          hide-details="auto"
          label="Адрес"
          clearable
      />
    </v-card-item>
    <v-card-actions>
      <v-btn rounded="lg" variant="tonal" @click="submitHandler">{{ buttonLabel || 'error' }}</v-btn>
      <v-btn v-if="clearVisible" rounded="lg" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>

import {putCustomer} from '../utils/methods/requests-customers';
import {addCustomer} from '../utils/methods/requests-customers';

const props = defineProps({
  activeCustomer: Object,
})

const customer = ref({...props.activeCustomer} || ({}));
const buttonLabel = ref(props.activeCustomer ? 'Изменить' : 'Добавить');
const clearVisible = !props.activeCustomer;
const submitHandler = props.activeCustomer ? put : add;

function clear() {

}

function put() {
  putCustomer({...customer}, 0)
      .then(r => {
        console.log('Запрос на изменение <<customer>> запрос успешно выполнен')
      })
      .catch(e => {
        console.log('Запрос на изменение <<customer>> завершен с ошибкой')
      })
      .finally(() => {
        console.log('Запрос на изменение завершен')
      });
}

function add() {
  addCustomer(customer || null, 0)
      .then(r => {
        console.log('Запрос на добавление <<customer>> запрос успешно выполнен')
      })
      .catch(e => {
        console.log('Запрос на добавление <<customer>> завершен с ошибкой')
      })
      .finally(() => {
        console.log('Запрос на добавление завершен')
      });
}

</script>