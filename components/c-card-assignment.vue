<template>
  <v-card
      @click="console.log('card click')"
      rounded
      density="compact"
      class="mx-auto"
      variant="tonal"
      color="indigo"
      max-height="100%"
  >
    <v-card-title>
      {{assignment.number}}
    </v-card-title>
    <v-card-subtitle class="d-flex ga-1">
      <span>Дата: {{assignment.signingDate}}</span>
      <span>Договор: {{assignment.contractNumber}}</span>
      <span>Дата договора: {{assignment.contractDate}}</span>
    </v-card-subtitle>
<!--    <v-card-item></v-card-item>-->
    <v-card-text>Lorem ipsum dolor sit amet, consectetur adipisicing.</v-card-text>
<!--    <v-card-actions></v-card-actions>-->
  </v-card>
</template>

<script>

export default {
  name: "c-card-assignment",
  props: {
    assignment: Object
  }
}
</script>

<style scoped>

</style>