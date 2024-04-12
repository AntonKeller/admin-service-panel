<template>
  <v-card
      rounded="lg"
      density="compact"
      color="indigo"
      variant="text"
      @click="cardClick(user)"
  >
    <v-card-title>
      <v-avatar color="indigo" rounded="lg">
        <v-icon size="small" color="white">mdi-account-network</v-icon>
      </v-avatar>
      {{user.firstName + ' ' + user.lastName}}
      <v-badge :color="Math.random() > 0.5 ? 'error' : 'success'" dot style="width: 8px; height: 16px" />
    </v-card-title>

    <v-card-subtitle>{{user.description}}</v-card-subtitle>

    <v-card-text class="d-flex ga-2">
      <v-chip
          density="default"
          prepend-icon="mdi-phone-outgoing-outline"
          rounded="sm"
          size="small"
          variant="tonal"
          color="blue"
          label
      >
        {{user.phoneNumber}}
      </v-chip>
      <v-chip
          :prepend-icon="icon"
          rounded="sm"
          size="small"
          variant="tonal"
          color="teal"
          label
      >
        {{user.email}}
      </v-chip>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "c-card-user",
    props: {
      icon: String,
      user: Object,
      cardClick: Function,
    }
  }
</script>

<style scoped>

</style>