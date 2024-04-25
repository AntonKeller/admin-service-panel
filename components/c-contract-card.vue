<template>
  <v-card
      color="indigo"
      variant='tonal'
      density="compact"
      rounded
  >
    <v-card-title>{{contract.contractNumber}}</v-card-title>
    <v-card-item append-icon="mdi-trash-can-outline">
      {{contract.contractDate}}
    </v-card-item>
  </v-card>
</template>

<script>
export default {
  name: "c-contract-card",
  props: ['contract']
}
</script>