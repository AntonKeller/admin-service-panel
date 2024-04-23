<template>
  <v-card density="compact" rounded variant="elevated" min-width="480" color="indigo-lighten-4">
    <v-card-title>Новое задание</v-card-title>
    <v-card-subtitle>Введите информацию о заказчике/организации</v-card-subtitle>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.number"
          hide-details="auto"
          label="Номер задания"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.signingDate"
          hide-details="auto"
          label="Дата подписания"
          clearable
      />
    </v-card-item>
    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="assignment.customerId"
          hide-details="auto"
          label="Заказчик"
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
      <v-btn rounded="sm" variant="tonal" @click="add">Добавить</v-btn>
      <v-btn rounded="sm" variant="tonal" @click="clear">Очистить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "c-assignment-add-overlay",

  props: {
    hideSelf: Function,
  },

  data: () => ({
    assignment: {
      number: '',
      signingDate: '',
      customerId: '',
      contractNumber: '',
      contractDate: '',
      blockList: [],
    },
  }),

  methods: {

    add() {

    },

  },

}
</script>

<style scoped>

</style>