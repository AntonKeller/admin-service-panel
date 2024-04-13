<template>
  <v-card variant="tonal" color="indigo-darken-4" density="compact" rounded="lg">
    <v-card-title>
      {{(customer?.name || 'name error') + ' / ' + (customer?.inn || 'inn error')}}
    </v-card-title>
    <v-card-subtitle>
      {{customer.address}}
    </v-card-subtitle>
    <v-card-item>
      <div class="d-flex ga-2">
        <v-chip
            prepend-icon="mdi-email"
            rounded="sm"
            size="small"
            variant="tonal"
            color="indigo"
            label
        >
          {{customer.emailAddress}}
        </v-chip>
        <v-chip
            prepend-icon="mdi-email"
            rounded="sm"
            size="small"
            variant="tonal"
            color="indigo"
            label
        >
          {{customer.phoneNumber}}
        </v-chip>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>

export default {
  name: "c-card-customer",
  props: {
    customer: Object,
  }
}
</script>

<style scoped>

</style>