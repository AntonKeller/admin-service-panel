<template>
  <v-card
      rounded
      density="compact"
      color="indigo"
      variant="tonal"
      @click="cardClick(user)"
  >
    <v-card-title>
      <v-avatar density="comfortable" color="indigo" rounded="lg">
        <v-icon size="x-small" color="white">mdi-account-network</v-icon>
      </v-avatar>
      <span class="d-inline-block ml-2">{{user.firstName + ' ' + user.lastName}}</span>
      <v-badge :color="Math.random() > 0.5 ? 'error' : 'success'" dot style="width: 8px; height: 16px" />
    </v-card-title>

    <v-card-subtitle>{{user.description}}</v-card-subtitle>

    <v-card-text class="d-flex ga-2">
      <v-chip
          density="default"
          prepend-icon="mdi-phone-outgoing-outline"
          rounded="lg"
          size="small"
          variant="tonal"
          color="blue"
          label
      >
        {{user.phoneNumber}}
      </v-chip>
      <v-chip
          :prepend-icon="icon"
          rounded="lg"
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