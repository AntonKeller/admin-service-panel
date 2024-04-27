<template>
  <v-card>
    <v-card-title>Новый договор</v-card-title>
    <v-card-subtitle>Заполните поля договора</v-card-subtitle>

    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="contract.contractNumber"
          hide-details="auto"
          label="Дата заключения договора"
          clearable
      />
    </v-card-item>

    <v-card-item>
      <v-text-field
          density="comfortable"
          v-model="contract.contractDate"
          hide-details="auto"
          label="Дата заключения договора"
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
  name: "c-contract-card-menu-add",

  data: () => ({
    contract: {
      contractNumber: '',
      contractDate: '',
    }
  }),

  methods: {
    clear() {
      this.contract = ({
        contractNumber: '',
        contractDate: '',
      });
    }
  }
}
</script>